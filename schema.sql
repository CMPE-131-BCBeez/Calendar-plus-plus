-- SQLITE3

CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Events (
    id INTEGER PRIMARY KEY,
    event_name TEXT NOT NULL
    event_type TEXT CHECK (event_type IN ('EVENT', 'REMINDER')) NOT NULL
);

CREATE TABLE IF NOT EXISTS UsersEvents (
    user_id INTEGER,
    event_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (event_id) REFERENCES Events(id),
    PRIMARY KEY (user_id, event_id)
);

CREATE TABLE IF NOT EXISTS