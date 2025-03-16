document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('button[type="button"]');
    const createUserButton = document.querySelector('button.create-user');
    const loginContainer = document.querySelector('.login-container');

    loginButton.addEventListener('click', handleLogin);
    createUserButton.addEventListener('click', handleCreateUser);

    // Save form data to local storage on input change
    const form = document.getElementById('loginForm');
    form.addEventListener('input', saveFormData);

    // Enter key tries to sign in, usability improvement
    loginContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });

    function handleLogin() {
        const username = document.querySelector('input[placeholder="Username"]').value;
        const password = document.querySelector('input[placeholder="Password"]').value;
        // Check both fields are filled
        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }
        // Mock login logic, uses localStorage to store user credentials
        // Replacing this with a real login system when database is created
        const storedPassword = localStorage.getItem(username);

        if (storedPassword && storedPassword === password) {
            alert('Login successful!');
            
            window.location.href = '/weekly';
        } else {
            alert('Invalid username or password.');
        }
    }
    // Mock create user logic, uses localStorage to store user credentials
    // Replacing this with a real user creation system when database is created
    function handleCreateUser() {
        const username = document.querySelector('input[placeholder="Username"]').value;
        const password = document.querySelector('input[placeholder="Password"]').value;

        if (!username || !password) {
            alert('Please enter both username and password.');
            return;
        }

        if (localStorage.getItem(username)) {
            alert('Username already exists.');
            return;
        }

        localStorage.setItem(username, password);
        alert('User created successfully!');
    }
        // Rudimentary "session" handling
        function saveFormData() {
            const form = document.getElementById('loginForm');
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            localStorage.setItem('formData', JSON.stringify(data));
        }
});

