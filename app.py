from flask import Flask, g, Response, request, redirect, session, flash, render_template
from datetime import *
from flask_session import Session
from flask_mail import Mail, Message
import tempfile
import email
import sqlite3
from werkzeug.local import LocalProxy
from werkzeug.security import generate_password_hash, check_password_hash
from typing import *
from utils import *

# Configure database
DATABASE = "calendar.db"
db_setup(DATABASE)

def make_dicts(cursor: sqlite3.Cursor, row: sqlite3.Row) -> Dict[Any, Any]:
    """
    changes sqlite3 rows into dictionaries, not to be called on its own, overloaded factory function for database connection
    """
    return dict((cursor.description[idx][0], value)
                for idx, value in enumerate(row))

def get_db() -> sqlite3.Connection:
    """
    Creates a database connection that can be used only in an application context, connection is closed after context ends
    """
    _db = getattr(g, '_database', None)
    if _db is None:
        _db = g._database = sqlite3.connect(DATABASE)
        _db.row_factory = sqlite3.Row
        _db.row_factory = make_dicts
    return _db

# Set up global variable to grab a connection with an application context
db: sqlite3.Connection = LocalProxy(get_db)

# Start flask app
app: Flask = Flask(__name__)
# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response: Response) -> Response:
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Closes db after an application context ends
@app.teardown_appcontext
def close_connection(exception: Exception):
    _db: sqlite3.Connection = getattr(g, '_database', None)
    if _db is not None:
        _db.close()

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = tempfile.mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Route handlers

@app.route("/")
def hello_world() -> str:
    """
    Testing route for now
    """
    return "<p>Hello, World!</p>"

@app.route("/register", methods=['GET', 'POST'])
def register_page() -> str:
    """
    Register page handler for GET and POST requests
    """
    # assume all validation has been done in the frontend
    if request.method == "POST":
        username = request.form.get('username')
        password_plaintext = request.form.get('password')
        password_hash = generate_password_hash(password_plaintext, "scrypt")
        email = request.form.get('email')
        firstName = request.form.get('firstName')
        lastName = request.form.get('lastName')

        with app.app_context():
            cursor = db.cursor()
            cursor.execute("SELECT username, email FROM Users WHERE username = ? OR email = ?", (username, email))
            res = cursor.fetchone()
            print(f"{res}")
            if (res):
                flash("This username already exists")
                return render_template("UserRegister.html"), 400 # TODO: change to template rendering once frontend decides how they want to handle errors
            query = """INSERT INTO Users (username, password_hash, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)"""
            
            cursor.execute(query, (username, password_hash, email, firstName, lastName))
            db.commit()
        
        return redirect("/login")
    else:
        return render_template("user_register.html")


#we will implement the login page which is just used to
#get credentials and verify correct login
@app.route("/login", methods = ["GET", "POST"])
def login():
    #validate user login info
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        
        #Retreive hashed password from database but we can move this to
        #the database funtions so that the devices dont get the hashed passwords
        with app.app_context():
            cursor = db.cursor()
            cursor.execute("SELECT username, password_hash FROM Users WHERE username=?", (username,))
            user = cursor.fetchone()
            
        #Check if user exists and verify password
        if user and check_password_hash(user["password_hash"], password):
            #set username in session to update user logged in
            session["username"] = user["username"]
            print(f"session {session}")
            return redirect("/monthly_calendar")

        #if login fails then redirect to the same login page
        else:
            flash("Invalid username or password")
    
    return render_template("login_page.html")
    
#implement the homecalendar page which will be the main user calendar
#this calendar includes all saved and shared events user has
@app.route("/monthly_calendar", methods = ["GET"])
@login_required
def monthly_calendar():
    return render_template("monthly_calendar.html")    
    

# @app.route("/weekly_calendar",methods =["POST"])
# @login_required
# def weeklycalendar():
#     username = session.get("username")
#     if username:
#         placeholder = 1
#     else:
#         return redirect("/login")

# may not be needed
# @app.route("/user_settings", methods = ["GET", "POST"])
# @login_required
# def user_settings():
#     if req9uest.method == "POST":
#         email

@app.route("/forgot_password", methods = ["GET", "POST"])
def forgot_password():
    if request.method=="POST":
        #get username or email
        username_or_email = request.form.get("username_or_email")

        #now we will get the username from our database through either 
        #username of email itself. we must verify if the user has an acc.
        if username_or_email != None:
            with app.app_context():
                cursor = db.cursor()
                cursor.execute("SELECT email FROM Users WHERE username=? OR email=?", (username_or_email, username_or_email))
                useremail = cursor.fetchone()
                eemail = cursor.fetchone()
                #check if username exists
                if useremail == None and eemail == None:
                    flash("username or email does not exist! \n please try again.")
                #now just verify if the user info match.
                if useremail != None and eemail != None:
                    if useremail != eemail:
                        flash("Information does not match!")
                    #lastly you succeed you will create a confirmation code and 
                    #send it to the user's email
                    else:
                        #generate the confirmation code
                        confirmation_code = generate_confirmation_code()
                        #now send the confirmation code you generated
                        send_confirmation_email(email, confirmation_code)
                        #finally save it to your database
                        with app.app_context():
                            cursor = db.cursor
                            cursor.execute("UPDATE Users SET confirmation_code=? WHERE email=? OR username =?", (confirmation_code, eemail, username_or_email))
                            db.commit()
                        flash("password changed successfully!")
                        return redirect("/change_password_email")

        else: 
            flash("Please enter a username or email")
    else:
        return render_template("forgot_password.html")
        

# @app.route("/change_password_vc", methods = ["GET", "POST"])

#create new event!
@app.route("/new_event", methods = ["GET","POST"])
@login_required
def new_event():
    username = session.get("username")
    if request.method == "POST":
        #get event data from form
        username = session
        title = request.form.get("title")
        description = request.form.get("description")
        start_time = request.form.get("start_time")
        end_time = request.form.get("end_time")
        location = request.form.get("location")
        color = request.form.get("color")
        type = request.form.get("type")

        is_valid, error_message = validate_event(title, start_time, end_time)
        if not is_valid:
            flash(error_message)
            return redirect("/new_event")
        
        #insert event into database 
        with app.app_context():
            cursor = db.cursor()
            #input the data to events
            query = """INSERT INTO Events (username, title, description, start_time, end_time, location, color, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"""
            #we might need to modify this in the future
            cursor.execute(query, (username, title, description, start_time, end_time, location, color, type))
            db.commit()
        
        flash("Event created successfully!")
        return redirect("/monthly_calendar")
    return render_template("new_event.html")

#changing a user's password
@app.route("/change_password_settings", methods = ["GET", "POST"])
@login_required
def change_password_settings():
    #get the password from the user input & update password
    if request.method == "POST":
        current_password = request.form.get("current_password")
        new_password = request.form.get("new_password")
        confirm_new_password = request.form.get("confirm_new_password")

        #to change password you need to input correct current pw
        username = session.get("username")
        current_password_hash = generate_password_hash(username)
        if check_password_hash(current_password_hash, current_password):
            #check if new passwords match
            if new_password == confirm_new_password:
                new_password_hash = generate_password_hash(new_password, "sha256")
                with app.app_context():
                    cursor = db.cursor
                    cursor.execute("UPDATE Users SET password_hash=? WHERE username=?", (new_password_hash, username))
                    db.commit()
                flash("password changed successfully!")
            else:
                flash("New password and confirm new password must match!\n")
        else:
            flash("Incorrect password, please enter current password")
        return redirect("/user_settings")
    
#changing a user's password
@app.route("/change_password_email", methods = ["GET", "POST"])
def change_password_email():
    #get the password from the user input & update password
    if request.method == "POST":
        current_password = request.form.get("current_password")
        new_password = request.form.get("new_password")
        confirm_new_password = request.form.get("confirm_new_password")

        #to change password you need to input correct current pw
        username = session.get("username")
        current_password_hash = generate_password_hash(username)
        if check_password_hash(current_password_hash, current_password):
            #check if new passwords match
            if new_password == confirm_new_password:
                new_password_hash = generate_password_hash(new_password, "sha256")
                with app.app_context():
                    cursor = db.cursor
                    cursor.execute("UPDATE Users SET password_hash=? WHERE username=?", (new_password_hash, username))
                    db.commit()
                flash("password changed successfully!")
            else:
                flash("New password and confirm new password must match!\n")
        else:
            flash("Incorrect password, please enter current password")
        return redirect("/user_settings")


@app.route("/data_management")
@login_required
def data_management():
    #This will allow the user to download their data or delete/edit
    return redirect("/user_settings")

@app.route("/security_setting")
@login_required
def security_setting():
    #I would like to implement the option of 2 step verification
    return redirect("/user_settings")

@app.route("/social_setting")
@login_required
def social_setting():
    #this will allow the users to share whole schedules/calendars
    #this will also allow them to block or unblock other users
    #create calendar groups etc.
    return redirect("/user_settings")
