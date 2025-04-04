document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('downloadBtn').addEventListener('click', generateCSV);
    document.getElementById('setWeekBtn').addEventListener('click', prePopulateDates);
    document.getElementById("addWeekBtn").addEventListener('click', addWeekToForm);
    document.getElementById("deleteWeekBtn").addEventListener('click', deleteWeekFromForm)
    document.getElementById('saveBtn').addEventListener('click', saveWeeklyData);

    // Pre-load the first dynamic week
    addWeekToForm();

    // Save form data to local storage on input change
    const form = document.getElementById('reportForm');
    form.addEventListener('input', saveFormData);
    // inition for week counting
    updateWeekCounter();
});

// Fix session handling, form data saving 
function saveFormData() {
    const form = document.getElementById('reportForm');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    localStorage.setItem('formData', JSON.stringify(data));
}

// Loads the saved formdata
function loadFormData() {
    const formData = JSON.parse(localStorage.getItem('formData') || '{}');
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = formData[key] === 'on';
                } else {
                    input.value = formData[key];
                }
            }
        }
    }
}

// Deleting added weeks
function deleteWeekFromForm() {
    const weekContainers = document.querySelectorAll('.day-container');

    if (weekCount > 2) {
        // Get the last 5 containers representing one week
        const lastWeekContainers = Array.from(weekContainers).slice(-5);

        // Remove all 5 containers
        lastWeekContainers.forEach(container => container.remove());
        
        // Decrement the week count
        weekCount--;

        // Enable the add week button when needed
        if (weekCount < 4) {
            document.getElementById('addWeekBtn').disabled = false;
        }

        // Update the week counter display
        updateWeekCounter();

    } else {
        alert('At least one week must remain in the form.');
    }
}


// More robust way for week counting
function updateWeekCounter() {
    const weekContainers = document.querySelectorAll('.day-container');
    weekCount = Math.ceil(weekContainers.length / 5); // Calculate the number of weeks
}

// Initial week is there
let weekCount = 0;

// Function to add a week to the form
function addWeekToForm() {
    if (weekCount < 5) {
        weekCount++; // Increment here for the week count with unique ID
        const weekTemplate = `
            <div class="day-container">
                <h2>Monday</h2>
                <label for="dateMonday${weekCount}" class="required">Date*:</label>
                <input type="text" name="dateMonday${weekCount}" readonly required>
                <label for="timeStartedMonday${weekCount}">Time Started:</label>
                <input type="text" name="timeStartedMonday${weekCount}">
                <label for="timeEndedMonday${weekCount}">Time Ended:</label>
                <input type="text" name="timeEndedMonday${weekCount}">
                <label for="lunchBreakMonday${weekCount}">Lunch Break:</label>
                <label class="custom-checkbox">
                    <input type="checkbox" id="lunchBreakMonday${weekCount}" name="lunchBreakMonday${weekCount}">
                </label>
                <label for="summaryMonday${weekCount}">Summary:</label>
                <textarea name="summaryMonday${weekCount}"></textarea>
                <label for="projectCodeMonday${weekCount}">Project Code:</label>
                <input type="text" name="projectCodeMonday${weekCount}">
            </div>
            <div class="day-container">
                <h2>Tuesday</h2>
                <label for="dateTuesday${weekCount}" class="required">Date*:</label>
                <input type="text" name="dateTuesday${weekCount}" readonly required>
                <label for="timeStartedTuesday${weekCount}">Time Started:</label>
                <input type="text" name="timeStartedTuesday${weekCount}">
                <label for="timeEndedTuesday${weekCount}">Time Ended:</label>
                <input type="text" name="timeEndedTuesday${weekCount}">
                <label for="lunchBreakTuesday${weekCount}">Lunch Break:</label>
                <label class="custom-checkbox">
                    <input type="checkbox" id="lunchBreakTuesday${weekCount}" name="lunchBreakTuesday${weekCount}">
                </label>
                <label for="summaryTuesday${weekCount}">Summary:</label>
                <textarea name="summaryTuesday${weekCount}"></textarea>
                <label for="projectCodeTuesday${weekCount}">Project Code:</label>
                <input type="text" name="projectCodeTuesday${weekCount}">
            </div>
            <div class="day-container">
                <h2>Wednesday</h2>
                <label for="dateWednesday${weekCount}" class="required">Date*:</label>
                <input type="text" name="dateWednesday${weekCount}" readonly required>
                <label for="timeStartedWednesday${weekCount}">Time Started:</label>
                <input type="text" name="timeStartedWednesday${weekCount}">
                <label for="timeEndedWednesday${weekCount}">Time Ended:</label>
                <input type="text" name="timeEndedWednesday${weekCount}">
                <label for="lunchBreakWednesday${weekCount}">Lunch Break:</label>
                <label class="custom-checkbox">
                    <input type="checkbox" id="lunchBreakWednesday${weekCount}" name="lunchBreakWednesday${weekCount}">
                </label>
                <label for="summaryWednesday${weekCount}">Summary:</label>
                <textarea name="summaryWednesday${weekCount}"></textarea>
                <label for="projectCodeWednesday${weekCount}">Project Code:</label>
                <input type="text" name="projectCodeWednesday${weekCount}">
            </div>
            <div class="day-container">
                <h2>Thursday</h2>
                <label for="dateThursday${weekCount}" class="required">Date*:</label>
                <input type="text" name="dateThursday${weekCount}" readonly required>
                <label for="timeStartedThursday${weekCount}" class="required">Time Started:</label>
                <input type="text" name="timeStartedThursday${weekCount}">
                <label for="timeEndedThursday${weekCount}">Time Ended:</label>
                <input type="text" name="timeEndedThursday${weekCount}">
                <label for="lunchBreakThursday${weekCount}">Lunch Break:</label>
                <label class="custom-checkbox">
                    <input type="checkbox" id="lunchBreakThursday${weekCount}" name="lunchBreakThursday${weekCount}">
                </label>
                <label for="summaryThursday${weekCount}">Summary:</label>
                <textarea name="summaryThursday${weekCount}"></textarea>
                <label for="projectCodeThursday${weekCount}">Project Code:</label>
                <input type="text" name="projectCodeThursday${weekCount}">
            </div>
            <div class="day-container">
                <h2>Friday</h2>
                <label for="dateFriday${weekCount}" class="required">Date*:</label>
                <input type="text" name="dateFriday${weekCount}" readonly required>
                <label for="timeStartedFriday${weekCount}">Time Started:</label>
                <input type="text" name="timeStartedFriday${weekCount}">
                <label for="timeEndedFriday${weekCount}">Time Ended:</label>
                <input type="text" name="timeEndedFriday${weekCount}">
                <label for="lunchBreakFriday${weekCount}">Lunch Break:</label>
                <label class="custom-checkbox">
                    <input type="checkbox" id="lunchBreakFriday${weekCount}" name="lunchBreakFriday${weekCount}">
                </label>
                <label for="summaryFriday${weekCount}">Summary:</label>
                <textarea name="summaryFriday${weekCount}"></textarea>
                <label for="projectCodeFriday${weekCount}">Project Code:</label>
                <input type="text" name="projectCodeFriday${weekCount}">
            </div>
        `;
        const weekContainer = document.createElement('div');
        weekContainer.innerHTML = weekTemplate;
        document.getElementById('weekContainers').appendChild(weekContainer);

        updateWeekCounter(); // Update the week counter after adding a new week
        loadFormData(); // Load saved form data for the new week
        if (weekCount >= 5) {
            document.getElementById('addWeekBtn').disabled = true; // Disable the button if max weeks reached
        }
    }   else {
        alert('Maximum of 4 weeks reached.');
    }
}

// Function to get the Monday of a given week number and year
function getMondayOfWeek(weekNumber, year) {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (weekNumber - 1) * 7;
    const mondayOffset = (firstDayOfYear.getDay() <= 1) ? 1 - firstDayOfYear.getDay() : 8 - firstDayOfYear.getDay() + 1;
    const monday = new Date(year, 0, 1 + mondayOffset + daysOffset);
    return monday;
}

// Pre-populate dates based on week number and year
function prePopulateDates() {
    const weekNumber = parseInt(document.getElementById('weekNumber').value);
    const year = parseInt(document.getElementById('year').value);
    const startDate = getMondayOfWeek(weekNumber, year);

    if (!startDate) {
        alert("Invalid week number or year. Please check your inputs.");
        return;
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let currentDate = new Date(startDate);

    for (let week = 1; week <= weekCount; week++) {
        daysOfWeek.forEach((day) => {
            const dateField = document.querySelector(`[name="date${day}${week}"]`);
            if (dateField) {
                dateField.value = currentDate.toISOString().split('T')[0];

                // Increment date by 1 day
                currentDate.setDate(currentDate.getDate() + 1);

                // Skip weekends
                if (currentDate.getDay() === 0) { // Sunday
                    currentDate.setDate(currentDate.getDate() + 2); // Move to Monday
                } else if (currentDate.getDay() === 7) { // Saturday
                    currentDate.setDate(currentDate.getDate() + 2); // Move to Monday
                }
            }
        });
    }

    saveFormData(); // Save the pre-populated dates to local storage
}

// Doing some math
function calculateHours(timeStarted, timeEnded, lunchBreak) {
    let hoursWorked = '';

    if (timeStarted && timeEnded) {
        const [startHour, startMinute] = timeStarted.split(':').map(Number);
        const [endHour, endMinute] = timeEnded.split(':').map(Number);
        const startTime = new Date(1970, 0, 1, startHour, startMinute);
        const endTime = new Date(1970, 0, 1, endHour, endMinute);
        hoursWorked = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours

        if (lunchBreak === 'Yes') {
            const lunch = parseFloat(document.getElementById('lunchBreakLength').value) || 0; // Get lunch break length or 0
            hoursWorked -= lunch;
        }

        hoursWorked = hoursWorked.toFixed(2);
    }

    return hoursWorked;
}

// Function to calculate total hours worked during a single week
function totalHoursWeek(week) {
    let totalWeekHours = 0;

    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((day) => {
        const timeStarted = document.querySelector(`[name="timeStarted${day}${week}"]`).value;
        const timeEnded = document.querySelector(`[name="timeEnded${day}${week}"]`).value;
        const lunchBreak = document.querySelector(`[name="lunchBreak${day}${week}"]`).checked ? 'Yes' : 'No';
        const hoursWorked = calculateHours(timeStarted, timeEnded, lunchBreak);
        if (hoursWorked) totalWeekHours += parseFloat(hoursWorked);
    });

    return totalWeekHours.toFixed(2);
}

// Function to calculate total hours worked during all weeks
function totalHoursAllWeeks() {
    let overallTotalHours = 0;

    for (let week = 1; week <= weekCount; week++) {
        overallTotalHours += parseFloat(totalHoursWeek(week));
    }

    return overallTotalHours.toFixed(2);
}

// Function to save weekly data to the database
async function saveWeeklyData() {
    const form = document.getElementById('reportForm');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Validate time fields
    for (let week = 1; week <= weekCount; week++) {
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((day) => {
            const timeStarted = data[`timeStarted${day}${week}`];
            const timeEnded = data[`timeEnded${day}${week}`];

            if (timeStarted && !/^\d{2}:\d{2}$/.test(timeStarted)) {
                alert(`Invalid time format for ${day} ${week}. Please use HH:MM.`);
                return;
            }
            if (timeEnded && !/^\d{2}:\d{2}$/.test(timeEnded)) {
                alert(`Invalid time format for ${day} ${week}. Please use HH:MM.`);
                return;
            }

            // Calculate hours worked
            const lunchBreak = data[`lunchBreak${day}${week}`] === 'on' ? 'Yes' : 'No';
            const hoursWorked = calculateHours(timeStarted, timeEnded, lunchBreak);
            data[`hoursWorked${day}${week}`] = hoursWorked || 0;
        });
    }

    try {
        const response = await fetch('/save-weekly-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.href = '/confirmation-weekly'; // Redirect to confirmation page
        } else {
            alert('Failed to save weekly data.');
        }
    } catch (error) {
        console.error('Error saving weekly data:', error);
        alert('An error occurred while saving weekly data.');
    }
}

// Function to generate CSV from form data
function generateCSV() {
    const csvData = [];
    let totalCSVHours = 0;

    // Add headers to CSV data
    csvData.push(['Day', 'Date', 'Time Started', 'Time Ended', 'Lunch Break', 'Summary', 'Project Code', 'Total Hours'].join('£')); // change the separator in join('')

    for (let week = 1; week <= weekCount; week++) {
        let weekTotal = 0;
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach((day) => {
            const dateField = document.querySelector(`[name="date${day}${week}"]`);
            if (dateField) {
                const date = dateField.value;
                const timeStarted = document.querySelector(`[name="timeStarted${day}${week}"]`).value;
                const timeEnded = document.querySelector(`[name="timeEnded${day}${week}"]`).value;
                const lunchBreak = document.querySelector(`[name="lunchBreak${day}${week}"]`).checked ? 'On' : null;
                const summary = document.querySelector(`[name="summary${day}${week}"]`).value;
                const projectCode = document.querySelector(`[name="projectCode${day}${week}"]`).value;

                const hoursWorked = calculateHours(timeStarted, timeEnded, lunchBreak);
                if (hoursWorked) {
                    totalCSVHours += parseFloat(hoursWorked);
                    weekTotal += parseFloat(hoursWorked);
                }
                csvData.push([day, date, timeStarted, timeEnded, lunchBreak, summary, projectCode, hoursWorked].join('£'));  // change the separator in join('')
            } else {
                console.error(`Element with name date${day}${week} not found`);
            }
        });
        // Add total hours for the week to the CSV
        csvData.push(['Total Hours for Week', '', '', '', '', '', '', weekTotal.toFixed(2)].join('£'));
    }

    // Add total hours for all weeks to the CSV
    csvData.push(['Total Hours for All Weeks', '', '', '', '', '', '', totalCSVHours.toFixed(2)].join('£'));

    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fileName = document.getElementById('filename').value || 'weekly_report_from_LogTool';
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}