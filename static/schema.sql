-- SQLITE3

CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(20) NOT NULL,
    confirmation_code VARCHAR(10),
    email VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS Calendars(
    id INTEGER PRIMARY KEY,
    user_id INT,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    calendar_id INT,
    title VARCHAR(50) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(50),
    color VARCHAR(15),
    type VARCHAR(8) CHECK (type IN ('EVENT', 'REMINDER', 'BIRTHDAY')) NOT NULL,
    FOREIGN KEY (calendar_id) REFERENCES Calendars(id)
);

CREATE TABLE IF NOT EXISTS UsersEvents (
    user_id INTEGER,
    event_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (event_id) REFERENCES Events(id)
);

CREATE TABLE IF NOT EXISTS Test (
    id INTEGER PRIMARY KEY,
    name TEXT
);

CREATE TABLE IF NOT EXISTS UserSettings(
    darkmode 
);
