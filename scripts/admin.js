document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("admin.html")) {
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
                window.location.href = "admin-dashboard.html";
            } else {
                errorMsg.textContent = result.error || "Invalid login";
            }
        } catch (error) {
            errorMsg.textContent = "Server error. Try again.";
        }
    });
}

async function loadAdminDashboard() {
    const studentCountElem = document.getElementById("studentCount");
    const courseCountElem = document.getElementById("courseCount");
    const studentListElem = document.getElementById("studentList");
    const updateRoleBtn = document.getElementById("updateRoleBtn");

    try {
        const response = await fetch("https://educationlife.pythonanywhere.com/admin/stats");
        const data = await response.json();

        studentCountElem.textContent = data.total_students;
        courseCountElem.textContent = data.total_courses;

        studentListElem.innerHTML = "";
        data.students.forEach(student => {
            let option = document.createElement("option");
            option.value = student.university_id;
            option.textContent = `${student.first_name} ${student.last_name}`;
            studentListElem.appendChild(option);
        });

        updateRoleBtn.addEventListener("click", async () => {
            const selectedStudent = studentListElem.value;
            if (!selectedStudent) return alert("Select a student!");

            const res = await fetch("https://educationlife.pythonanywhere.com/admin/change-role", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ university_id: selectedStudent })
            });

            if (res.ok) {
                alert("Student role updated to Instructor!");
                location.reload();
            } else {
                alert("Failed to update role.");
            }
        });

    } catch (error) {
        console.error("Error loading admin dashboard:", error);
    }
}