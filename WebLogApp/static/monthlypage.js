
// Fix imports and exports

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('downloadBtn').addEventListener('click', generateCSV);
    document.getElementById('setMonthBtn').addEventListener('click', prePopulateWeeks);
    document.getElementById('saveBtn').addEventListener('click', saveMonthlyData);
    loadFormData();

    // Save form data to local storage on input change
    const form = document.getElementById('reportForm');
    form.addEventListener('input', saveFormData);
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

// Load form data from local storage
function loadFormData() {
    const formData = JSON.parse(localStorage.getItem('formData') || '{}');
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = formData[key];
            }
        }
    }
}

// Get week number of the year based on date
function getWeekNumber(date) {
    const firstJanuary = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstJanuary) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + firstJanuary.getDay() + 1) / 7);
    return weekNumber;
}

// Pre-populate week fields based on month and year
function prePopulateWeeks() {
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const startWeekNumber = getWeekNumber(firstDayOfMonth);

    if (isNaN(month) || isNaN(year)) {
        alert("Invalid month or year. Please check your inputs.");
        return;
    }

    for (let i = 0; i < 4; i++) {
        const weekField = document.querySelector(`[name="week${i + 1}"]`);
        const weekNumber = startWeekNumber + i;
        const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });
        weekField.value = `Week ${weekNumber} ${monthName} ${year}`;
    }

    saveFormData(); // Save the pre-populated weeks to local storage
}

function saveMonthlyData() {
    // Create function to save data to created database here
    // Create function to save data to created database here
    // Create function to save data to created database here
    // Create function to save data to created database here
}

// Generate CSV file from form data
function generateCSV() {
    const form = document.getElementById('reportForm');
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
        if (!field.checkValidity()) {
            valid = false;
            field.reportValidity(); // Report the first invalid field to the user
        }
    });

    if (!valid) {
        alert("Please fill out all required fields.");
        return;
    }

    const formData = new FormData(form);
    const weeks = ['1', '2', '3', '4'];
    const csvData = [];
    const headers = ['Week', 'Weekly Hours', 'Project Code', 'Summary'];
    csvData.push(headers.join(',')); // Add headers to CSV data
    let totalHours = 0;

    weeks.forEach(week => {
        const weekOfMonth = formData.get(`week${week}`);
        const weeklyHours = formData.get(`weeklyHours${week}`);
        const projectCode = formData.get(`projectCode${week}`);
        const summary = formData.get(`summary${week}`) || '';

        totalHours += parseFloat(weeklyHours);
        const row = [weekOfMonth, weeklyHours, projectCode, summary];
        csvData.push(row.join(',')); // Add row to CSV data
    });

    // Add total hours row
    csvData.push(['Total Hours', totalHours.toFixed(2), '', '']);

    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fileName = document.getElementById('filename').value || 'monthly_report_from_LogTool';
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`; // Name of the file
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
