from flask import Flask, g, Response, request, redirect, session, flash, render_template, send_file
from datetime import datetime
from pytz import timezone
from flask_session import Session
from flask_mail import Mail, Message
import tempfile
from werkzeug.local import LocalProxy
from werkzeug.security import generate_password_hash, check_password_hash
from typing import *
from utils import *
import json
import os
import resend
from collections import defaultdict
import weather
import os
import resend


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
mail = Mail(app)
# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True
resend.api_key = "re_FvWGLqJc_J1bw8bdwYMCV74gK5eCdEbJ2"

#I have ben trying to get this to work with email but I cannot for the life of me make it work
#the issue here is that the gmail I made for the class needs an app password but this option does 
#not appear when I go to settings-security-2step verification
#app.config['MAIL_SERVER']='smtp.gmail.com'
#app.config['MAIL_PORT'] = 465
#app.config['MAIL_USERNAME'] = ['calandarPlusPlus@gmail.com']
#app.config['MAIL_PASSWORD'] = ['gfzq hpoy dzsr ivsk'] #ThisAintItFr2025
#app.config['MAIL_USE_TLS'] = False
#app.config['MAIL_USE_SSL'] = True
#mail = Mail(app)

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
def landing_route() -> str:
    """
    Testing route for now
    """
    if session.get('user_id'):
        return redirect("/monthly_calendar")
    else:
        return redirect("/login")

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
                return render_template("user_register.html"), 400 # TODO: change to template rendering once frontend decides how they want to handle errors
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
            cursor.execute("SELECT id, username, password_hash FROM Users WHERE username=?", (username,))
            user = cursor.fetchone()
            
        #Check if user exists and verify password
        if user and check_password_hash(user["password_hash"], password):
            #set username in session to update user logged in
            session["user_id"] = user["id"]
            return redirect("/monthly_calendar")

        #if login fails then redirect to the same login page
        else:
            flash("Invalid username or password")
    
    return render_template("login_page.html")
    
#logout the current user
@app.route("/logout", methods = ["GET", "POST"])
@login_required
def logout():
    session.clear()
    return redirect("/login")


#implement the homecalendar page which will be the main user calendar
#this calendar includes all saved and shared events user has
@app.route("/monthly_calendar", methods = ["GET"])
@login_required
def monthly_calendar():

    return render_template("monthly_calendar.html")    
    

# @app.route("/weekly_calendar",methods =["POST"])
# @login_required
# def weeklycalendar():
#     user_id = session.get("user_id")
#     if user_id:
#         placeholder = 1
#     else:
#         return redirect("/login")


@app.route('/weekly_calendar')
def weekly_calendar():
    return render_template('weekly_calendar.html')

@app.route('/daily_calendar')
def daily_calendar():
    return render_template('daily_calendar.html')
 

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
                cursor.execute("""SELECT email FROM Users WHERE username=(?) OR email=(?)""", (username_or_email, username_or_email)) 
                email = None
                email = cursor.fetchone() 
                flash(f"the content of the cursor is: {email}")
    
                if email is None:
                    flash("username or email does not exist! \n please try again.")
                    return render_template("forgot_password.html")
                else:
                    #lastly you succeed you will create a confirmation code and 
                    #send it to the user's email
                    
                    #generate the confirmation code
                    confirmation_code = generate_confirmation_code()
                    #now send the confirmation code you generated
                    subject = "Confirm Your Email Address"
                    body = f"Please click the following link to confirm your email address: /confirm_email? your codecode={confirmation_code}"
                    sender = "calendarPlusPlus@gmail.com"
                    #msg = Message(subject, sender = sender, recipients=[email], body=body)
                    #mail.send(msg)



                    r = resend.Emails.send({
                        "from": "onboarding@resend.dev",
                        "to": "calandarplusplus@gmail.com",
                        "subject": "Confirm Your Email Address",
                        "html": f"Please click the following link to confirm your email address: /confirm_email? your codecode={confirmation_code}"
                    })  
                    
                    #finally save it to your database
                    with app.app_context():
                        cursor = db.cursor()
                        cursor.execute("""UPDATE Users SET confirmation_code=(?) WHERE email=(?) OR username =(?)""", (confirmation_code, username_or_email, username_or_email))
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
    if request.method == "POST":
        #get event data from form
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
            query = """INSERT INTO Events (title, description, start_time, end_time, location, color, type) VALUES (?, ?, ?, ?, ?, ?, ?)"""
            #we might need to modify this in the future
            cursor.execute(query, (title, description, start_time, end_time, location, color, type))
            db.commit()
            event_id = cursor.execute("SELECT last_insert_rowid() AS last").fetchone()['last']
            cursor.execute("INSERT INTO UsersEvents (user_id, event_id) VALUES (?, ?)", (session['user_id'], event_id))
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
        user_id = session.get("user_id")
        with app.app_context():
            cursor = db.cursor()
            username = cursor.execute("SELECT username FROM Users WHERE id = ?", (user_id,)).fetchone()['username']
        current_password_hash = generate_password_hash(username)
        if check_password_hash(current_password_hash, current_password):
            #check if new passwords match
            if new_password == confirm_new_password:
                new_password_hash = generate_password_hash(new_password, "sha256")
                with app.app_context():
                    cursor = db.cursor()
                    cursor.execute("UPDATE Users SET password_hash=? WHERE username=?", (new_password_hash, username))
                    db.commit()
                flash("password changed successfully!")
                render_template("change_password_settings")
            else:
                flash("New password and confirm new password must match!\n")
        else:
            flash("Incorrect password, please enter current password")
            return redirect("/user_settings")
    return render_template("change_password_settings.html")
    
#changing a user's password
@app.route("/change_password_email", methods = ["GET", "POST"])
def change_password_email():
    #get the password from the user input & update password
    if request.method == "POST":
        username = request.form.get("username")
        confirmation_code = request.form.get("confirmation_code")
        new_password = request.form.get("new_password")
        confirm_new_password = request.form.get("confirm_new_password")
        
        #to change password you need to input correct confirmation code
        with app.app_context():
                cursor = db.cursor()
                saved_confirmation_code = cursor.execute("""SELECT confirmation_code FROM Users WHERE username=(?) """, (username,)).fetchone()['confirmation_code']
                flash(f"the content of the cursor is: {saved_confirmation_code}")
    
        if saved_confirmation_code == None:
            flash("Information does not match!\n please try again")
            render_template("change_password_email.html")
        elif confirmation_code == saved_confirmation_code:
            #check if new passwords match
            if new_password == confirm_new_password:
                new_password_hash = generate_password_hash(new_password, "sha256")
                with app.app_context():
                    cursor = db.cursor
                    cursor.execute("""UPDATE Users SET password_hash=? WHERE username=?""", (new_password_hash, username))
                    db.commit()
                flash("password changed successfully!")
                return redirect("/login")
            else:
                flash("New password and confirm new password must match!\n")
        else:
            flash("Incorrect confirmation code, please enter the latest Confirmation Code.")
    return render_template("change_password_email.html")

@app.route("/data_management", methods = ["GET", "POST"])
@login_required
def data_management():
    #This will allow the user to download their data or delete/edit  
    return render_template("data_management.html")

@app.route("/change_username", methods = ["GET", "POST"])
@login_required
def change_username():
    if request.method == "POST":
        new_username = request.form.get("new_username")
        with app.app_context():
            cursor = db.cursor()
            query ="""SELECT confirmation_code FROM Users WHERE username=(?) """
            cursor.execute(query, (new_username,))
            user = cursor.fetchone()
        
        if not user:
            # Update the username in the database
            with app.app_context():
                cursor = db.cursor()
                cursor.execute("""UPDATE Users SET username = ? WHERE id = ?""", (new_username, session.get("user_id")))
                db.commit()
                flash("Username changed successfully!")
                return redirect("/data_management")  # Redirect to the same page after username change
        else:
            flash("That username already exists, try another one.")
            return redirect("/data_management")
        
@app.route("/security_settings")
@login_required
def security_settings():
    user_id = session.get("user_id")
    #flash(f'user: {user_id}')
    with app.app_context():
        cursor = db.cursor()
        cursor.execute("""SELECT email FROM BackupEmails WHERE id = ?""", (user_id,))
        backup_emails = cursor.fetchall()
        #flash (f"Backup Emails:{backup_emails}")
    if not backup_emails:
        return render_template("security_settings.html", backup_emails=None)  # Pass None if no emails found
    else:
        #get the emails as a list now if more than one.
        backUp = [entry["email"] for entry in backup_emails]
        return render_template("security_settings.html", backup_emails=backUp)  # Pass the list of emails

#add the backup email fucntionality
@app.route('/add_backup_email', methods = ["GET","POST"])
@login_required
def add_backup_email():
    #get the data
    user_id = session.get("user_id")
    email = request.form.get('backup_email')
    
    with app.app_context():
        try:
            #try to add the email
            cursor = db.cursor()
            cursor.execute("INSERT INTO BackupEmails (email,user_id) VALUES (?,?)", (email, user_id))
            db.commit()
            flash("Email added successfully.")
        except Exception as e:
            # Roll back transaction if an error occurs
            db.rollback()
            flash("An error occurred while adding the backup email.")
        
    return redirect("/security_settings")

#delete user's calendars
@app.route("/delete_user_calendars", methods = ["GET", "POST"])
@login_required
def delete_user_data():
    if request.method == "POST":
        user_id = session.get("user_id")
        password = request.form.get("password")

        #Retreive hashed password from database but we can move this to
        #the database funtions so that the devices dont get the hashed passwords
        with app.app_context():
            cursor = db.cursor()
            cursor.execute("SELECT id, username, password_hash FROM Users WHERE username=?", (user_id,))
            user = cursor.fetchone()
            
        #Check if user exists and verify password
        if user and check_password_hash(user["password_hash"], password):
            #right password so we will go ahead and delete all the data we have related to this user_id
            with app.app_context():
                cursor = db.cursor()
                try:
                    cursor.execute("BEGIN TRANSACTION")

                    # Delete user data from various tables
                    query = """
                    DELETE FROM Calendars WHERE id = ?;
                    DELETE FROM Events WHERE id = ?;
                    """
                    cursor.execute(query, (user_id, user_id,))

                    # Commit the transaction
                    db.commit()

                except Exception as e:
                    # Rollback the transaction if an error occurs
                    cursor.execute("ROLLBACK")
                    flash("An error occurred while deleting your account. Please try again.")
    
            flash("Calendars Deleted.")
            return redirect("/data_management")

        #if login fails then redirect to the same login page
        else:
            flash("Invalid password")
    #load html           
    return redirect("/data_management")

@app.route("/download_data", methods = ["GET", "POST"])
@login_required
def download_data():
    user_id = session.get("user_id")
    #retrieve user data
    with app.app_context():
        cursor = db.cursor()
        try:
            cursor.execute("BEGIN TRANSACTION")

            # Delete user data from various tables
            query = """
            SELECT * FROM BackupEmails WHERE id = ?;
            SELECT * FROM Calendars WHERE id = ?;
            SELECT * FROM Events WHERE id = ?;
            SELECT * FROM StyleSettings WHERE id = ?;
            SELECT * FROM UsersEvents WHERE id = ?;
            """
            cursor.execute(query, (user_id, user_id, user_id, user_id, user_id,))
            user_data = cursor.fetchall()
        except Exception as e:
            # Rollback the transaction if an error occurs
            cursor.execute("ROLLBACK")
            flash("An error occurred while retreiving your data, try again.")
            return redirect("/data_management")
    
    # Write the data to a temporary file on the server
    with tempfile.NamedTemporaryFile(mode="w", delete=False) as users_data:
        for row in user_data:
            users_data.write(str(row) + "\n")

    # Send the file to the user for download
    try:
        return send_file(users_data.name, as_attachment=True, attachment_filename="user_data.txt")

    finally:
        # Clean up the temporary file after the download
        users_data.close()
        os.remove(users_data.name)
        return redirect("/data_management")

@app.route("/social_settings", methods = ["GET"])
@login_required
def social_setting():
    #this will allow the users to share whole schedules/calendars
    #this will also allow them to block or unblock other users
    #create calendar groups etc.

    return render_template("social_settings.html")

@app.route("/style_settings", methods = ["GET"])
@login_required
def style_settings():
    return render_template("style_settings.html")


@app.route("/delete_account", methods=["GET", "POST"])
@login_required
def delete_account():
    if request.method == "POST":
        user_id = session.get("user_id")
        password = request.form.get("current_password")
        users_reason = request.form.get("description")

        #Retreive hashed password from database but we can move this to
        #the database funtions so that the devices dont get the hashed passwords
        with app.app_context():
            cursor = db.cursor()
            cursor.execute("SELECT id, username, password_hash FROM Users WHERE username=?", (user_id,))
            user = cursor.fetchone()
            
        #Check if user exists and verify password
        if user and check_password_hash(user["password_hash"], password):
            #right password so we will go ahead and delete all the data we have related to this user_id
            with app.app_context():
                cursor = db.cursor()
                try:
                    cursor.execute("BEGIN TRANSACTION")

                    # Delete user data from various tables
                    query = """
                    DELETE FROM Users WHERE id = ?;
                    DELETE FROM BackupEmails WHERE id = ?;
                    DELETE FROM Calendars WHERE id = ?;
                    DELETE FROM Events WHERE id = ?;
                    DELETE FROM StyleSettings WHERE id = ?;
                    DELETE FROM UsersEvents WHERE id = ?;
                    """
                    cursor.execute(query, (user_id, user_id, user_id, user_id, user_id, user_id))

                    # Commit the transaction
                    db.commit()

                    # Insert reason into EndTies table
                    cursor.execute("INSERT INTO EndTies (reasons) VALUES (?)", (users_reason,))
                    db.commit()
                except Exception as e:
                    # Rollback the transaction if an error occurs
                    cursor.execute("ROLLBACK")
                    flash("An error occurred while deleting your account. Please try again.")
    
            flash("Sorry to see you go!")
            # Clear session and redirect to the login page
            session.clear()
            flash("Your account has been deleted successfully.")
            return redirect("/login")

        #if login fails then redirect to the same login page
        else:
            flash("Invalid password")
    #load html           
    return render_template("delete_account.html")



@app.route("/api/events")
def event_api():
    if session.get("user_id") is None:
        return {"error_msg":"Not logged in.", "user_id": None}, 403

    # Args should be: start_date, end_date
    get_args = request.args
    if len(get_args) < 2 or (not (request.args.get('start_time') and request.args.get('end_time'))):
        return {"error_msg":"Invalid arguments.", "start_time": get_args.get("start_time"), "end_time": get_args.get("end_time")}, 400
    
    try:
        start_time_ts = int(request.args['start_time'])
        end_time_ts = int(request.args['end_time'])
    except ValueError:
        return {"error_msg":"Invalid timestamp format.", "start_time": get_args.get("start_time"), "end_time": get_args.get("end_time")}, 400

    start_datetime = datetime.fromtimestamp(start_time_ts)
    end_datetime = datetime.fromtimestamp(end_time_ts)
 
    query = """
    SELECT Events.title, Events.description, Events.start_time, Events.end_time, Events.location, Events.color, Events.type
    FROM Events 
    INNER JOIN UsersEvents ON Events.id = UsersEvents.event_id
    INNER JOIN Users ON UsersEvents.user_id = Users.id
    WHERE Users.id = ?
    AND Events.start_time >= ? AND Events.end_time < ?
    ORDER BY Events.start_time ASC
    """

    records = None
    with app.app_context():
        cursor = db.cursor()
        cursor.execute(query, (session['user_id'], start_datetime, end_datetime))
        records = cursor.fetchall()
    
    if not records:
        {}, 404
    
    

    output_dict = defaultdict(lambda: [])
    
    for r in records:
        date_ts = int(datetime.timestamp(datetime.strptime(r['start_time'], "%Y-%m-%d %H:%M:%S").replace(hour=0, minute=0, second=0)))
        r['start_time'] = int(datetime.timestamp(datetime.strptime(r['start_time'], "%Y-%m-%d %H:%M:%S")))
        r['end_time'] = int(datetime.timestamp(datetime.strptime(r['end_time'], "%Y-%m-%d %H:%M:%S")))
        output_dict[date_ts].append(r)
    

    return output_dict



@app.route("/api/weather")
def weather_api():
    if session.get("user_id") is None:
        return {"error_msg":"Not logged in.", "user_id": None}, 403

    # Args should be: start_date, end_date
    get_args = request.args
    if len(get_args) < 4 or (not (request.args.get('start_time') and request.args.get('end_time') and request.args.get('lat') and request.args.get('lng'))):
        return {"error_msg":"Invalid arguments.", "start_time": get_args.get("start_time"), "end_time": get_args.get("end_time")}, 400
    
    try:
        start_time_ts = int(request.args['start_time'])
        end_time_ts = int(request.args['end_time'])
        lat = float(request.args['lat'])
        lng = float(request.args['lng'])
    except ValueError:
        return {"error_msg":"Invalid timestamp format.", "start_time": get_args.get("start_time"), "end_time": get_args.get("end_time")}, 400

    start_datetime = datetime.fromtimestamp(start_time_ts)
    end_datetime = datetime.fromtimestamp(end_time_ts)

    return weather.getWeather(lat, lng, start_datetime, end_datetime)

@app.route('/upload_wallpaper', methods = ["GET","POST"])
def upload():
    if request.method == "POST":
        if 'image' not in request.files:         # error if there is no image selected
            flash('wallpaper image is not selected') 
            return redirect("/settings")
    
        file = request.files['image']
        if file.filename == '':                  # error if image file was empty
            flash('Can not find the wallpaper image') 
            return redirect("/settings")
    
        filename = file.filename  #get the filename

        file_path = os.path.join('static', 'image', filename)
        file.save(file_path)

        # try:
        #     with app.app_context():
        #         cursor = db.cursor()    #input the data to events
        #         query = """INSERT INTO UserSettings () VALUES (?)"""
        #         cursor.execute(query, (filename, type))
        #         db.commit()
        #         event_id = cursor.execute("SELECT last_insert_rowid() AS last").fetchone()['last']
        #         db.commit()
        # except sqlite3.Error as e:
        #     db.rollback()
        #     return f'Error: {e}'

        with app.app_context():
    
            flash(f'The "{filename}" is now your wallpaper!!')
    
        background_image_url = f"../image/{filename}" 

    else:
        background_image_url = "../image/default-background.jpg"
    
    return render_template('settings_page.html', background_image_url=background_image_url)

@app.route('/dark_mode', methods = ["GET","POST"])
def dark_mode():
    if request.method=="POST":
        theme_state = request.json
        is_dark_mode = request.form.get('is_dark_mode')
        with app.app_context():
            cursor = db.cursor()
            res = cursor.fetchone()
            print(f"{res}")
            if (res):
                flash("This username already exists")
                return render_template("user_register.html"), 400 # TODO: change to template rendering once frontend decides how they want to handle errors
            query = """INSERT INTO Users (username, password_hash, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)"""
            
            cursor.execute(query, (is_dark_mode))
            db.commit()
        
        return redirect("/settings")
    else:
        return render_template('layout.html', is_dark_mode=is_dark_mode)