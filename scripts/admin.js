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
                localStorage.setItem("adminToken", result.token);
                window.location.href = "admin-dashboard.html";
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

async function loadAdminDashboard() {
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
        alert("Access Denied! Please log in as Admin.");
        window.location.href = "index.html";
        return;
    }

    try {
        // Verify session
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