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

    // 3. Fetch Courses
    async function fetchCourses() {
        try {
            const response = await fetch('https://Educationlife.pythonanywhere.com/courses/');
            const data = await response.json();
            console.log('Fetched Courses:', data.courses);

            let courseList = document.getElementById('course-list');
            if (courseList) {
                courseList.innerHTML = '';

                data.courses.forEach(course => {
                    let courseItem = document.createElement('li');
                    courseItem.textContent = course;
                    courseList.appendChild(courseItem);
                });
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    // Run course fetch if on the courses page
    if (window.location.pathname === '/courses.html') {
        fetchCourses();
    }

    // 4. Login Form
    if (window.location.pathname === '/signin.html') {
        const loginForm = document.querySelector('form');

        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent form submission

            const studentId = document.getElementById('univid').value;
            const password = document.getElementById('Password').value;

            if (!studentId || !password) {
                alert('Please fill in both fields');
                return;
            }

            try {
                const response = await fetch('https://Educationlife.pythonanywhere.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ university_id: studentId, password: password })
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Login successful!');
                    localStorage.setItem('user', JSON.stringify(result)); // Save user info
                    window.location.href = 'dashboard.html';
                } else {
                    alert(result.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('Server error. Try again later.');
            }
        });
    }

    // 5. Registration Form
    if (window.location.pathname === '/signup.html') {
        const registerForm = document.querySelector('form');

        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const firstName = document.getElementById('Fname').value;
            const lastName = document.getElementById('Lname').value;
            const studentId = document.getElementById('StId').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('Password').value;
            const confirmPassword = document.getElementById('ConfirmPassword').value;
            const errorMessage = document.getElementById('error');

            errorMessage.textContent = '';

            if (!firstName || !lastName || !studentId || !email || !password || !confirmPassword) {
                errorMessage.textContent = 'Please fill in all fields.';
                return;
            }

            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match.';
                return;
            }

            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)) {
                errorMessage.textContent = 'Please enter a valid email address.';
                return;
            }

            if (password.length < 8) {
                errorMessage.textContent = 'Password must be at least 8 characters long.';
                return;
            }

            try {
                const response = await fetch('https://Educationlife.pythonanywhere.com/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        university_id: studentId,
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Registration successful! You can now log in.');
                    window.location.href = 'signin.html';
                } else {
                    errorMessage.textContent = result.message || 'Registration failed';
                }
            } catch (error) {
                console.error('Error registering:', error);
                errorMessage.textContent = 'Server error. Try again later.';
            }
        });
    }
});