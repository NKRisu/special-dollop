# WebLogApp

WebLogApp is a logging tool designed to help users track their weekly and monthly work hours. It provides a user-friendly interface for logging work details, generating reports, and saving data to a database.

## Features

- **User Authentication**: Secure login and registration system with hashed passwords.
- **Weekly Logging**: Log daily work hours, summaries, and project codes for up to 4 weeks. Includes ability to change the lunchbreak length and on which days break has been taken.
- **Monthly Logging**: Summarize weekly logs into monthly reports.
- **Dynamic Forms**: System adds or removes weekly forms dynamically. No hard coded forms!
- **CSV Export**: Generate CSV reports for weekly and monthly logs for local handling.
- **Data Persistence**: Save logs to a PostgreSQL database.
- **Responsive Design**: User-friendly interface with a modern design.
- **Easy changes to CSV separator in code**: Changes to separator in CSV-format is easily changed.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Deno.js
- **Database**: PostgreSQL
- **Libraries**:
  - [bcrypt](https://deno.land/x/bcrypt) for password hashing
  - [zod](https://deno.land/x/zod) for input validation

## Installation

- Clone the repository: git clone https://github.com/your-repo/WebLogApp.git | cd WebLogApp .
- Install PostgreSQL and check that it has been installed properly.
- Create a database named "logtool-db".
- Set up the database with SQL script: psql -U postgres -d logtool-db -f db/system_structure.sql .
- Configure the database connection in code at db/db.js with your own credentials!!!
- Run the application with: deno run --allow-net --allow-env --allow-read --watch app.js .

## Usage

- Use of the application requires account creation and login.
- Creating account is very easy with any email and any password.
- Recommended to NOT use any actual email you may actually use. System only checks if the field has been filled with an email.

### Weekly Logging

- Navigate to the **Weekly Logging Tool**.
- Enter the week number and year, then click "Set Week".
- Select lunch break length
- Fill in the daily work details (time started, time ended, lunch break, summary, project code).
- Add or remove weeks as needed using the "Add Week" and "Delete Week" buttons.
- Save the log or download it as a CSV file.

### Monthly Logging

- Navigate to the **Monthly Logging Tool**.
- Enter the month and year, then click "Set Month".
- Fill in the weekly hours, project codes, and summaries for each week.
- Save the log or download it as a CSV file.

## Database Schema for development purposes

### `zephyr_users`
- `user_id`: Primary key
- `username`: User's email (unique)
- `password_hash`: Hashed password
- `user_token`: UUID for pseudonymization
- `role`: User role (default: `user`)

### `zephyr_weekly_logs`
- `log_id`: Primary key
- `user_token`: Foreign key referencing `zephyr_users`
- `week_number`: Week number
- `year`: Year
- `day`: Day of the week
- `date`: Date
- `time_started`: Start time
- `time_ended`: End time
- `lunch_break`: Boolean indicating if a lunch break was taken
- `summary`: Work summary
- `project_code`: Project code
- `hours_worked`: Total hours worked

### `zephyr_monthly_logs`
- `log_id`: Primary key
- `user_token`: Foreign key referencing `zephyr_users`
- `month`: Month
- `year`: Year
- `total_hours`: Total hours worked in the month

### `zephyr_admin_logs`
- `log_id`: Primary key
- `admin_id`: Foreign key referencing `zephyr_users`
- `action`: Admin action description
- `resource_id`: ID of the affected resource
- `timestamp`: Timestamp of the action

## Security Features

- **Password Hashing**: User passwords are hashed using bcrypt.
- **Session Management**: Secure session handling with UUIDs and cookies.
- **Pseudonymization**: User data is pseudonymized using UUIDs.

## Deno and PostgreSQL links and help

- [Deno](https://deno.land/) for the runtime environment.
- [PostgreSQL](https://www.postgresql.org/) for the database.
- [bcrypt](https://deno.land/x/bcrypt) for password hashing.
- [zod](https://deno.land/x/zod) for input validation.