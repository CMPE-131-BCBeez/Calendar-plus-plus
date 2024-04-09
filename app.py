from flask import Flask, g, Response, request, redirect, session, flash

from flask_session import Session
import tempfile
import sqlite3
from werkzeug.local import LocalProxy
from werkzeug.security import generate_password_hash, check_password_hash
from typing import *
from flask import Flask, render_template

import utils

# Configure database
DATABASE = "calendar.db"
utils.db_setup(DATABASE)

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
app = Flask(__name__)
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
        password_hash = generate_password_hash(password_plaintext, "sha256")
        email = request.form.get('email')
        firstName = request.form.get('firstName')
        lastName = request.form.get('lastName')

        with app.app_context():
            cursor = db.cursor()
            cursor.execute("SELECT username, email FROM Users")
            res = cursor.fetchone()
            if (res):
                return "User exists", 400 # TODO: change to template rendering once frontend decides how they want to handle errors
            query = """INSERT INTO Users (username, password_hash, email, firstName, lastName) VALUES (?, ?, ?, ?, ?)"""
            
            cursor.execute(query, (username, password_hash, email, firstName, lastName))
            db.commit()
        
        return redirect("/login")
    else:
        return "register page!" # TODO: assemble with frontend


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
        return redirect("/home_calendar")

    #if login fails then redirect to the same login page
    else:
        flash(error = "Invalid username or password")

    return render_template("Loginpage.html")         
    
#implement the homecalendar page which will be the main user calendar
#this calendar includes all saved and shared events user has
@app.route("/homecalendar", methods = ["POST"])
@login_required
def homecalendar():
    username = session.get("username")
    if username:
        #continue to the homecalendar
        place_holder
    else:
        return redirect("/login")      
"""
may not be needed
@app.route("/user_settings", methods = ["GET", "POST"])
@login_required
def user_settings():
    if request.method == "POST":
        email
"""

#changing a user's password
@app.route("/change_password", methods = ["GET", "POST"])
@login_required
def change_password():
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
def data_management():
    #I would like to implement the option of 2 step verification
    return redirect("/user_settings")

@app.route("/social_setting")
@login_required
def data_management():
    #this will allow the users to share whole schedules/calendars
    #this will also allow them to block or unblock other users
    #create calendar groups etc.
    return redirect("/user_settings")

