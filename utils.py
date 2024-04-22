from flask import redirect, session
from datetime import *
from pytz import timezone
import string
import random
from flask_mail import Mail, Message

import sqlite3
import os
from typing import Callable


def login_required(f: Callable) -> Callable:
    """

    Decorator for routes that should only be visited by users that are logged in, verifies that they're logged in via session context
    """
    def decorated_function(*args, **kwargs):
        if session.get("username") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def generate_confirmation_code():
    # Generate a random string of letters and digits
    code_length = 10
    return ''.join(random.choices(string.ascii_letters + string.digits, k=code_length))

def send_confirmation_email(email, confirmation_code):
    subject = "Confirm Your Email Address"
    body = f"Please click the following link to confirm your email address: /confirm_email? your codecode={confirmation_code}"
    sender = "calendarPlusPlus@gmail.com"
    msg = Message(subject, sender = sender, recipients=[email], body=body)
    Mail.send(msg)

def db_setup(db_path: str):
    """
    Configures database from SQL script in static/schema.sql. To be ran ONLY before flask app starts (and only once)

    db_path - A string that contains a path to the database that should be used for the flask app.
    """
    init_con = sqlite3.connect(db_path)
    cursor = init_con.cursor()
    if not os.path.isfile('static/schema.sql'):
        raise FileNotFoundError("schema.sql is not in its proper place. please place schema.sql in the static folder")
    with open('static/schema.sql') as sql_file:
        cursor.executescript(sql_file.read())
    init_con.commit()
    init_con.close()


#this will take care of the timezone 
def convert_to_timezone(date_str, from_tz, to_tz):
    #this will convert from one timezone to another timezone
    #parse datetime string to datetime object
    dt = datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")

    #get both from and to timezones
    from_timezone = timezone(from_tz)
    to_timezone = timezone(to_tz)

    #convert datetime to source timezone
    dt = from_timezone.localize(dt)
    dt = from_timezone(to_timezone)

    #format to target timezone
    return dt.strftime("%M-%D-%Y %H:%M:%S")
"""
example how to use in the app.py or wherever we want to implement it
from utils import convert_to_timezone

# Example usage
dt_str = "2024-03-08 10:00:00"
from_tz = "UTC"
to_tz = "America/New_York"

converted_dt_str = convert_to_timezone(dt_str, from_tz, to_tz)
print("Converted datetime:", converted_dt_str)
"""
#This will validate the event data when you are trying to create
#a new event so that you dont create grabage
def validate_event(title, start_time, end_time):
    #check if fields are filled
    if not title or not start_time or not end_time:
        return False, "Please enter all required fields.\n"
    #check if start_time is before end_time
    try:
        if start_time >= end_time:
            return False, "End time must be after start time."
    except ValueError:
        return False, "Invalid date/time format."
    
#EVENT IS VALID
    return True, None 

