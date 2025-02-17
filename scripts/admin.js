document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("admin/index.html")) {
        setupAdminLogin();
    } else if (window.location.pathname.includes("admin-dashboard.html")) {
        loadAdminDashboard();
    }
});

function setupAdminLogin() {
    const loginForm = document.getElementById("adminLoginForm");

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("adminUsername").value;
        const password = document.getElementById("adminPassword").value;
        const errorMsg = document.getElementById("adminLoginError");

        try {
            const response = await fetch("https://educationlife.pythonanywhere.com/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem("adminToken", result.token);
                window.location.href = "admin-dashboard.html";  // Redirects to dashboard
            } else {
                errorMsg.textContent = result.error || "Invalid login";
            }
        } catch (error) {
            errorMsg.textContent = "Server error. Try again.";
        }
    });
}