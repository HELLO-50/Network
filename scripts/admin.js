document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("admin/index.html")) {
        setupAdminLogin();
    } else if (window.location.pathname.includes("admin-dashboard.html")) {
        enforceAdminAuth();
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

        errorMsg.textContent = ""; // Clear previous errors

        try {
            const response = await fetch("https://educationlife.pythonanywhere.com/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Login Successful:", result);
                localStorage.setItem("adminToken", result.token);  // Save token
                window.location.href = "admin-dashboard.html";  // Redirect to dashboard
            } else {
                console.error("Login Failed:", result);
                errorMsg.textContent = result.error || "Invalid login credentials";
            }
        } catch (error) {
            console.error("Error logging in:", error);
            errorMsg.textContent = "Server error. Try again later.";
        }
    });
}

function enforceAdminAuth() {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
        alert("Access Denied! Please log in as Admin.");
        window.location.href = "index.html";  // Redirect to login page
    }
}