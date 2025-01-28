document.addEventListener('DOMContentLoaded', function() {
    // 1. Active navigation link based on the current page
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });

    // 2. Smooth scrolling effect for anchor links (if any)
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    if (window.location.pathname === '/signin.html') {
        const loginForm = document.querySelector('form');
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form submission
    
            // Get values from input fields
            const studentId = document.getElementById('univid').value;
            const password = document.getElementById('Password').value;
    
            // Basic validation
            if (!studentId || !password) {
                alert('Please fill in both fields');
                return;
            }
    
            // Get the user data from localStorage
            const userData = localStorage.getItem(studentId);
            
            // Check if user exists and passwords match
            if (userData) {
                const parsedData = JSON.parse(userData);
                
                if (parsedData.password === password) {
                    // Successful login
                    alert('Login successful!');
                    window.location.href = 'dashboard.html'; // Redirect to the student dashboard
                } else {
                    alert('Incorrect password');
                }
            } else {
                alert('User not found');
            }
        });
    }
    
    
    // 4. Registration Form Validation - Only on the Registration Page
    if (window.location.pathname === '/signup.html') {
        const registerForm = document.querySelector('form');
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent form submission
            
            // Get values from input fields
            const firstName = document.getElementById('Fname').value;
            const lastName = document.getElementById('Lname').value;
            const studentId = document.getElementById('StId').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('Password').value;
            const confirmPassword = document.getElementById('ConfirmPassword').value;
            const errorMessage = document.getElementById('error');
    
            // Reset error message
            errorMessage.textContent = '';
    
            // Basic validation
            if (!firstName || !lastName || !studentId || !email || !password || !confirmPassword) {
                errorMessage.textContent = 'Please fill in all fields.';
                return;
            }
    
            // Check if passwords match
            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match.';
                return;
            }
    
            // Validate email format using regex
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)) {
                errorMessage.textContent = 'Please enter a valid email address.';
                return;
            }
    
            // Check password length
            if (password.length < 8) {
                errorMessage.textContent = 'Password must be at least 8 characters long.';
                return;
            }
    
            // Create user data object
            const userData = {
                firstName: firstName,
                lastName: lastName,
                studentId: studentId,
                email: email,
                password: password,
            };
    
            // Save user data to localStorage
            localStorage.setItem(studentId, JSON.stringify(userData));
    
            // Simulate form submission success
            alert('Registration successful! You can now log in.');
    
            // Redirect to login page
            window.location.href = 'signin.html';
        });
    }
});    