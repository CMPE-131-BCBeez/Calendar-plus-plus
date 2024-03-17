-- SQLITE3

CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    user_password VARCHAR(20) NOT NULL,
    user_salt INT NOT NULL,
    user_email VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS Calendars(
    calendar_id INT PRIMARY KEY,
    user_id INT,
    calendar_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS Events (
    event_id INTEGER PRIMARY KEY,
    calendar_id INT,
    event_name VARCHAR(50) NOT NULL,
    event_details TEXT,
    event_start DATETIME NOT NULL,
    event_end DATETIME NOT NULL,
    event_type VARCHAR(8) CHECK (event_type IN ('EVENT', 'REMINDER')) NOT NULL,
    FOREIGN KEY (calendar_id) REFERENCES Calendars(calendar_id)
);

CREATE TABLE IF NOT EXISTS UsersEvents (
    user_id INTEGER,
    event_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (event_id) REFERENCES Events(id),
    PRIMARY KEY (user_id, event_id)
);
