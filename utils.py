from flask import redirect, session
import sqlite3
import os
from typing import Callable


def login_required(f: Callable) -> Callable:
    """
    Decorator for routes that should only be visited by users that are logged in, verifies that they're logged in via session context
    """
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

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

