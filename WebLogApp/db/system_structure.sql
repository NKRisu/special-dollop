-- enable the uuid-ossp extension 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- enable crypto functions
CREATE EXTENSION pgcrypto;

-- Users table: Minimized personal information, pseudonymization via user_token
CREATE TABLE zephyr_users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    user_token UUID UNIQUE DEFAULT uuid_generate_v4()  -- Pseudonymized identifier
);

-- Weekly logs table: Detailed log entries for weekly hours
CREATE TABLE zephyr_weekly_logs (
    log_id SERIAL PRIMARY KEY,
    user_token UUID REFERENCES zephyr_users(user_token) ON DELETE CASCADE, -- Pseudonym reference
    week_number INT NOT NULL,
    year INT NOT NULL,
    day VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    time_started TIME,
    time_ended TIME,
    lunch_break BOOLEAN,
    summary TEXT,
    project_code VARCHAR(50),
    hours_worked DECIMAL(5, 2) NOT NULL
);

-- Monthly logs table: Summary of weekly logs for each month
CREATE TABLE zephyr_monthly_logs (
    log_id SERIAL PRIMARY KEY,
    user_token UUID REFERENCES zephyr_users(user_token) ON DELETE CASCADE, -- Pseudonym reference
    month INT NOT NULL,
    year INT NOT NULL,
    total_hours DECIMAL(5, 2) NOT NULL
);

-- Admin logs table: Tracks administrator actions, e.g., add/delete resources, without exposing sensitive data
CREATE TABLE zephyr_admin_logs (
    log_id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES zephyr_users(user_id),
    action VARCHAR(255) NOT NULL,
    resource_id INT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Deletion function for the right to erasure (compliant with GDPR)
CREATE OR REPLACE FUNCTION zephyr_erase_user(user_id_to_erase INT) RETURNS VOID AS $$
DECLARE
    user_token_to_erase UUID;
BEGIN
    -- Find the pseudonym (token) of the user to erase
    SELECT user_token INTO user_token_to_erase FROM zephyr_users WHERE user_id = user_id_to_erase;

    -- Delete user and associated data
    DELETE FROM zephyr_weekly_logs WHERE user_token = user_token_to_erase;
    DELETE FROM zephyr_monthly_logs WHERE user_token = user_token_to_erase;
    DELETE FROM zephyr_users WHERE user_id = user_id_to_erase;
    
    -- Optionally, delete admin logs associated with the user
    DELETE FROM zephyr_admin_logs WHERE admin_id = user_id_to_erase;
END;
$$ LANGUAGE plpgsql;