document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('downloadBtn').addEventListener('click', generateCSV);
    document.getElementById('startDate').addEventListener('change', prePopulateDates);

    loadFormData();

    // Save form data to local storage on input change
    const form = document.getElementById('reportForm');
    form.addEventListener('input', saveFormData);
});

function saveFormData() {
    const form = document.getElementById('reportForm');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    localStorage.setItem('formData', JSON.stringify(data));
}

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

function prePopulateDates() {
    const startDateInput = document.getElementById('startDate');
    const startDate = new Date(startDateInput.value);

    if (!isNaN(startDate)) {
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        daysOfWeek.forEach((day, index) => {
            const dateField = document.querySelector(`[name="date${day}"]`);
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + index);
            dateField.value = currentDate.toISOString().split('T')[0];
        });
    }

    saveFormData(); // Save the pre-populated dates to local storage
}

function generateCSV() {
    const form = document.getElementById('reportForm');
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
            // Calculate hours worked
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

    // Add total hours row
    csvData.push(['', '', '', '', '', '', 'Total Hours Worked', totalHours.toFixed(2)].join(','));

    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'weekly_report.csv'; // Name of the file
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
