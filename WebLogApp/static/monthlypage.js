document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('downloadBtn').addEventListener('click', generateCSV);
    document.getElementById('setMonthBtn').addEventListener('click', prePopulateWeeks);

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
                input.value = formData[key];
            }
        }
    }
}

function getWeekNumber(date) {
    const firstJanuary = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstJanuary) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + firstJanuary.getDay() + 1) / 7);
    return weekNumber;
}

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
    link.href = URL.createObjectURL(blob);
    link.download = 'monthly_report.csv'; // Name of the file
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
