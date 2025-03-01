document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('downloadBtn').addEventListener('click', generateCSV);
    document.getElementById('setWeekBtn').addEventListener('click', prePopulateDates);
    document.getElementById("addWeekBtn").addEventListener('click', addWeekToForm);
    document.getElementById("deleteWeekBtn").addEventListener('click', deleteWeekFromForm)

    // Save form data to local storage on input change
    const form = document.getElementById('reportForm');
    form.addEventListener('input', saveFormData);
    // inition for week counting
    updateWeekCounter();
});
// Rudimentary "session" handling
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

    if (weekContainers.length > 5) {
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

let weekCount = 1; // Initial week is already present

// More robust way for week counting
function updateWeekCounter() {
    const weekContainers = document.querySelectorAll('.day-container');
    weekCount = Math.ceil(weekContainers.length / 5); // Calculate the number of weeks
}

// Adding weeks with HTML form, very clunky. Should edit this later.
function addWeekToForm() {
    if (weekCount < 4) {
        const weekTemplate = `
            <div class="day-container">
                <h2>Monday</h2>
                <label for="dateMonday" class="required">Date*:</label>
                <input type="text" name="dateMonday" readonly required>
                <label for="timeStartedMonday">Time Started:</label>
                <input type="text" name="timeStartedMonday">
                <label for="timeEndedMonday">Time Ended:</label>
                <input type="text" name="timeEndedMonday">
                <label for="lunchBreakMonday" class="required">Lunch Break:</label>
                <input type="checkbox" id="lunchBreakMonday" name="lunchBreakMonday">
                <label for="lunchBreakMonday"></label>
                <label for="summaryMonday">Summary:</label>
                <textarea name="summaryMonday"></textarea>
                <label for="projectCodeMonday">Project Code:</label>
                <input type="text" name="projectCodeMonday">
            </div>
            <div class="day-container">
                <h2>Tuesday</h2>
                <label for="dateTuesday" class="required">Date*:</label>
                <input type="text" name="dateTuesday" readonly required>
                <label for="timeStartedTuesday">Time Started:</label>
                <input type="text" name="timeStartedTuesday">
                <label for="timeEndedTuesday">Time Ended:</label>
                <input type="text" name="timeEndedTuesday">
                <label for="lunchBreakTuesday">Lunch Break:</label>
                <input type="checkbox" id="lunchBreakTuesday" name="lunchBreakTuesday">
                <label for="lunchBreakTuesday"></label>
                <label for="summaryTuesday">Summary:</label>
                <textarea name="summaryTuesday"></textarea>
                <label for="projectCodeTuesday">Project Code:</label>
                <input type="text" name="projectCodeTuesday">
            </div>
            <div class="day-container">
                <h2>Wednesday</h2>
                <label for="dateWednesday" class="required">Date*:</label>
                <input type="text" name="dateWednesday" readonly required>
                <label for="timeStartedWednesday">Time Started:</label>
                <input type="text" name="timeStartedWednesday">
                <label for="timeEndedWednesday">Time Ended:</label>
                <input type="text" name="timeEndedWednesday">
                <label for="lunchBreakWednesday">Lunch Break:</label>
                <input type="checkbox" id="lunchBreakWednesday" name="lunchBreakWednesday">
                <label for="lunchBreakWednesday"></label>
                <label for="summaryWednesday">Summary:</label>
                <textarea name="summaryWednesday"></textarea>
                <label for="projectCodeWednesday">Project Code:</label>
                <input type="text" name="projectCodeWednesday">
            </div>
            <div class="day-container">
                <h2>Thursday</h2>
                <label for="dateThursday" class="required">Date*:</label>
                <input type="text" name="dateThursday" readonly required>
                <label for="timeStartedThursday" class="required">Time Started:</label>
                <input type="text" name="timeStartedThursday">
                <label for="timeEndedThursday">Time Ended:</label>
                <input type="text" name="timeEndedThursday">
                <label for="lunchBreakThursday">Lunch Break:</label>
                <input type="checkbox" id="lunchBreakThursday" name="lunchBreakThursday">
                <label for="lunchBreakThursday"></label>
                <label for="summaryThursday">Summary:</label>
                <textarea name="summaryThursday"></textarea>
                <label for="projectCodeThursday">Project Code:</label>
                <input type="text" name="projectCodeThursday">
            </div>
            <div class="day-container">
                <h2>Friday</h2>
                <label for="dateFriday" class="required">Date*:</label>
                <input type="text" name="dateFriday" readonly required>
                <label for="timeStartedFriday">Time Started:</label>
                <input type="text" name="timeStartedFriday">
                <label for="timeEndedFriday">Time Ended:</label>
                <input type="text" name="timeEndedFriday">
                <label for="lunchBreakFriday">Lunch Break:</label>
                <input type="checkbox" id="lunchBreakFriday" name="lunchBreakFriday">
                <label for="lunchBreakFriday"></label>
                <label for="summaryFriday">Summary:</label>
                <textarea name="summaryFriday"></textarea>
                <label for="projectCodeFriday">Project Code:</label>
                <input type="text" name="projectCodeFriday">
            </div>
        `;

        const weekContainer = document.createElement("div");
        weekContainer.innerHTML = weekTemplate;
        const addWeekBtn = document.getElementById("addWeekBtn");
        const reportForm = document.getElementById("reportForm");
        reportForm.insertBefore(weekContainer, addWeekBtn);

        weekCount++;
        if (weekCount === 4) {
            addWeekBtn.disabled = true;
        }
        // Keep the counter up to date
        updateWeekCounter();
    }
}


function getMondayOfWeek(weekNumber, year) {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (weekNumber - 1) * 7;
    const mondayOffset = (firstDayOfYear.getDay() <= 1) ? 1 - firstDayOfYear.getDay() : 8 - firstDayOfYear.getDay() + 1;
    const monday = new Date(year, 0, 1 + mondayOffset + daysOffset);
    return monday;
}

function prePopulateDates() {
    const weekNumber = parseInt(document.getElementById('weekNumber').value);
    const year = parseInt(document.getElementById('year').value);
    const startDate = getMondayOfWeek(weekNumber, year);

    if (!startDate) {
        alert("Invalid week number or year. Please check your inputs.");
        return;
    }

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const weekContainers = document.querySelectorAll('.day-container');

    let currentDate = new Date(startDate);

    weekContainers.forEach((weekContainer) => {
        daysOfWeek.forEach((day) => {
            const dateField = weekContainer.querySelector(`[name="date${day}"]`);
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
    });

    saveFormData(); // Save the pre-populated dates to local storage
}

function generateCSV() {
    const form = document.getElementById('reportForm');
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
        if (!field.checkValidity()) {
            valid = false;
            field.reportValidity();
        }
    });

    if (!valid) {
        alert("Please fill out all required fields.");
        return;
    }

    const formData = new FormData(form);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const csvData = [];
    const headers = ['Day', 'Date', 'Time Started', 'Time Ended', 'Lunch Break', 'Summary', 'Project Code', 'Hours Worked'];
    csvData.push(headers.join(',')); // Add headers to CSV data
    let totalHours = 0;

    days.forEach(day => {
        const date = formData.get(`date${day}`);
        const timeStarted = formData.get(`timeStarted${day}`);
        const timeEnded = formData.get(`timeEnded${day}`);
        const lunchBreak = formData.get(`lunchBreak${day}`) === 'on';
        const summary = formData.get(`summary${day}`);
        const projectCode = formData.get(`projectCode${day}`);

        let hoursWorked = '';
        if (date && timeStarted && timeEnded) {
            const startTime = new Date(`1970-01-01T${timeStarted}:00`);
            const endTime = new Date(`1970-01-01T${timeEnded}:00`);
            hoursWorked = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours

            if (lunchBreak) {
                hoursWorked -= 0.5; // Subtract 0.5 hours for lunch break
            }

            totalHours += hoursWorked;
            hoursWorked = hoursWorked.toFixed(2);
        }

        const row = [day, date, timeStarted, timeEnded, lunchBreak ? 'Yes' : 'No', summary, projectCode, hoursWorked];
        csvData.push(row.join(',')); // Add row to CSV data
    });

    csvData.push(['', '', '', '', '', '', 'Total Hours Worked', totalHours.toFixed(2)].join(','));

    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'weekly_report.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
