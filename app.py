from flask import Flask, g, Response, request, redirect, session
from flask_session import Session
import tempfile
import sqlite3
from werkzeug.local import LocalProxy
from werkzeug.security import generate_password_hash, check_password_hash
from typing import *

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
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')

        with app.app_context():
            cursor = db.cursor()
            cursor.execute("SELECT username, email FROM Users")
            res = cursor.fetchone()
            if (res):
                return "User exists", 400 # TODO: change to template rendering once frontend decides how they want to handle errors
            query = """INSERT INTO Users (username, password_hash, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)"""
            
            cursor.execute(query, (username, password_hash, email, first_name, last_name))
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
            return redirect("/home_calendar", error = "Invalid username or password")

        #if login fails then redirect to the same login page
        else:
            return redirect("/login")         
    
    #implement the homecalendar page which will be the main user calendar
    #this calendar includes all saved and shared events user has
    @app.route("/homecalendar", methods = ["POST"])
    def homecalendar():
        username = session.get("username")
        if username:
            #continue to the homecalendar
        else:
            return redirect("/login")

        
