document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("admin/index.html")) {
        setupAdminLogin();
    } else if (window.location.pathname.includes("admin-dashboard.html")) {
        enforceAdminAuth();  // ✅ Ensure this function exists
        loadAdminDashboard();
    }
});

// function to enforce authentication
function enforceAdminAuth() {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
        alert("Access Denied! Please log in as Admin.");
        window.location.href = "index.html";  // Redirect to login page
        return;
    }
}

// load the admin dashboard
async function loadAdminDashboard() {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
        alert("Access Denied! Please log in as Admin.");
        window.location.href = "index.html";
        return;
    }

    try {
        // Verify session with backend
        const verifyResponse = await fetch("https://educationlife.pythonanywhere.com/admin/verify", {
            method: "GET",
            headers: { "Authorization": adminToken }
        });

        if (!verifyResponse.ok) {
            alert("Session Expired! Please log in again.");
            localStorage.removeItem("adminToken");
            window.location.href = "index.html";
            return;
        }

        // Fetch admin stats
        const response = await fetch("https://educationlife.pythonanywhere.com/admin/stats", {
            method: "GET",
            headers: { "Authorization": adminToken }
        });

        const data = await response.json();

        document.getElementById("studentCount").textContent = data.total_students;
        document.getElementById("courseCount").textContent = data.total_courses;

        const studentListElem = document.getElementById("studentList");
        studentListElem.innerHTML = "";

        data.students.forEach(student => {
            let option = document.createElement("option");
            option.value = student.university_id;
            option.textContent = `${student.first_name} ${student.last_name}`;
            studentListElem.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading admin dashboard:", error);
    }
}
// admin page login
function setupAdminLogin() {
    console.log("✅ setupAdminLogin() is running!");
    const loginForm = document.getElementById("adminLoginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();  // Prevent page reload

            const username = document.getElementById("adminUsername").value;
            const password = document.getElementById("adminPassword").value;

            try {
                const response = await fetch("/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("adminToken", data.token);
                    window.location.href = "admin-dashboard.html"; // Redirect to dashboard
                } else {
                    document.getElementById("adminLoginError").textContent = data.error;
                }
            } catch (error) {
                console.error("Login error:", error);
                document.getElementById("adminLoginError").textContent = "Login failed. Please try again.";
            }
        });
    }
}