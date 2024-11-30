document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Clear previous error messages
        loginMessage.textContent = '';
        loginMessage.className = '';

        try {
            console.log('Attempting login with:', { username, password });  // Debug log

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            console.log('Server response status:', response.status);  // Debug log

            const data = await response.json();
            console.log('Server response data:', data);  // Debug log

            if (response.ok && data.token) {
                console.log('Login successful, storing token');  // Debug log
                localStorage.setItem('adminToken', data.token);
                window.location.href = '/admin/dashboard.html';
            } else {
                console.log('Login failed:', data.message);  // Debug log
                loginMessage.textContent = data.message || 'Login failed. Please try again.';
                loginMessage.className = 'alert alert-danger mt-3';
            }
        } catch (error) {
            console.error('Login error:', error);  // Debug log
            loginMessage.textContent = 'An error occurred. Please try again.';
            loginMessage.className = 'alert alert-danger mt-3';
        }
    });
});
