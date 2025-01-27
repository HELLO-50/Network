document.addEventListener('DOMContentLoaded', () => {
    // Highlight active menu item
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });

    // Smooth scrolling for hero buttons
    let ctaButtons = document.querySelectorAll('.cta-buttons a');
    ctaButtons.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            const targetId = button.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.error(`Element with ID ${targetId} not found.`);
            }
            
        });
    });

    // Interactivity for feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = '#f0f0f0';
        });
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
        });
    });
});
