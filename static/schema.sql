-- SQLITE3

CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(20) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS Calendars(
    id INT PRIMARY KEY,
    user_id INT,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Events (
    id INTEGER PRIMARY KEY,
    calendar_id INT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    start_timestamp DATETIME NOT NULL,
    end_timestamp DATETIME NOT NULL,
    type VARCHAR(8) CHECK (type IN ('EVENT', 'REMINDER')) NOT NULL,
    FOREIGN KEY (calendar_id) REFERENCES Calendars(id)
);

CREATE TABLE IF NOT EXISTS UsersEvents (
    user_id INTEGER,
    event_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (event_id) REFERENCES Events(id),
    PRIMARY KEY (user_id, event_id)
);

CREATE TABLE IF NOT EXISTS Test (
    id INTEGER PRIMARY KEY,
    name TEXT
);
