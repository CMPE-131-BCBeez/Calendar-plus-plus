import hashlib
import secrets
import sqlite3

def hash_password(password, username):
    #connect to the database
    conn = sqlite3.connect('input the database name')
    cursor = conn.cursor()
    #using the salt created at user registration
    cursor.execute("SELECT user_salt FROM Users WHERE username =?", (username))
    salt = cursor.fetchone()
    #hash the password that was entered  
    hashed_password = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 10000)
    return hashed_password.hex()

