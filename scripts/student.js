// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Handle Logout Button
    const logoutButton = document.querySelector('.log-out a');
    logoutButton.addEventListener('click', function () {
        // Perform logout logic here (for now we just redirect to signin.html)
        window.location.href = 'index.html'; // Redirect to Sign In page
    });

    // Toggle active section when clicking on the sidebar links
    const sidebarLinks = document.querySelectorAll('.menu a');
    const sections = document.querySelectorAll('.section');

    sidebarLinks.forEach((link, index) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            // Remove active class from all sidebar links
            sidebarLinks.forEach(link => link.classList.remove('active'));
            // Add active class to the clicked link
            link.classList.add('active');
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            // Show the clicked section
            sections[index].classList.add('active');
        });
    });

    // Set the first section as active by default
    sections[0].classList.add('active');
    sidebarLinks[0].classList.add('active');
});


