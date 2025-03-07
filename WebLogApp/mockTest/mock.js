// Sample test data
const mockData = [
    { day: 'Monday', date: '01/03/2025', timeStarted: '09:00', timeEnded: '17:00', lunchBreak: 'Yes', summary: 'Completed project milestone', projectCode: 'P123', hoursWorked: '7.50' },
    { day: 'Tuesday', date: '02/03/2025', timeStarted: '09:00', timeEnded: '17:00', lunchBreak: 'No', summary: 'Worked on bug fixes', projectCode: 'P123', hoursWorked: '8.00' },
    { day: 'Wednesday', date: '03/03/2025', timeStarted: '09:00', timeEnded: '17:00', lunchBreak: 'Yes', summary: 'Met with client', projectCode: 'P124', hoursWorked: '7.50' },
    { day: 'Thursday', date: '04/03/2025', timeStarted: '09:00', timeEnded: '17:00', lunchBreak: 'No', summary: 'Developed new feature', projectCode: 'P123', hoursWorked: '8.00' },
    { day: 'Friday', date: '05/03/2025', timeStarted: '09:00', timeEnded: '17:00', lunchBreak: 'Yes', summary: 'Code review', projectCode: 'P123', hoursWorked: '7.50' },
    { day: 'Total Hours for Week', hoursWorked: '38.50' },
    { day: 'Monday', date: '08/03/2025', timeStarted: '09:00', timeEnded: '17:00', lunchBreak: 'No', summary: 'Worked on documentation', projectCode: 'P125', hoursWorked: '8.00' },
    { day: 'Total Hours for Week', hoursWorked: '40.00' },
    { day: 'Total Hours for All Weeks', hoursWorked: '78.50' }
];

// Example CSV generation
function generateMockCSV(data) {
    const headers = ['Day', 'Date', 'Time Started', 'Time Ended', 'Lunch Break', 'Summary', 'Project Code', 'Total Hours'].join('£');
    const rows = data.map(entry => [
        entry.day,
        entry.date || '',
        entry.timeStarted || '',
        entry.timeEnded || '',
        entry.lunchBreak || '',
        entry.summary || '',
        entry.projectCode || '',
        entry.hoursWorked
    ].join('£'));
    return [headers, ...rows].join('\n');
}

console.log('Mock CSV output:\n', generateMockCSV(mockData));
