# LogTool webapp for logging in working hours with summary and details.
Webapp for logging in hours, short summary and stuff


## How to use the app

Select start date to populate the date fields, fill in start time and end time for each day of week. Click on lunch breack if you had one. Write a short summary of your work on the days you have worked. Lastly add the project code into its own field.

For opening file created in Excel:
1. Click "Dowload the CSV-file". 
2. Open Excel.
3. Navigate to "Data" in Excel.
4. Select "From text/CSV".
5. Locate your file, most likely in dowloads folder...
6. Select "import".
8. Change separator to "custom", type in: "£", or what ever may be set to be the separator, you can see this in the preview window as random character between words.
9. Click "load".
10. Wo-hoo! Your hours have beem logged into excel-file and you may save the excel file for later use.

For saving the file:
1. Fill the fields as usual.
2. Click save button.
3. Server redirects you to confirmation page.

OR

4. Page will show error that you can fix in your inputs.
5. Save again.

## Functions

- Rudimentary session handling
- Automatic field population
- Automatic hour calculation and conversion
- 5-days of logging, and
- monthly logging by the week
- Based on weeks, works over month borders
- Lunch break deduction
- Adding weeks to weekly logging
- Removing weeks from weekly logging
- File name field
- Lunch break length option
- Separator change made and marked in code
- Total hours per week
- Total hours overall
- Code comments
- Index page, login page, account creation page
- Confirmation pages for actions done
- Database functionality for account creation, login, sign out, weekly and monthly logs

## To-Do list

add and improve the following subjets:

- Security measures
- Admin functionality
- Production readiness soonTM

