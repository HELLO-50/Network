from flask import Blueprint, request, jsonify
from models import db, User, Course

admin_bp = Blueprint("admin", __name__)

def get_admin_password():
    try:
        with open("/home/Educationlife/Network/admin.sec", "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        print("Error: Admin password file is missing!")
        return None

@admin_bp.route("/login", methods=["POST"])
def admin_login():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        ADMIN_USERNAME = "admin"
        correct_hashed_password = get_admin_password()

        if not correct_hashed_password:
            return jsonify({"error": "Admin password file missing"}), 500

        if username != ADMIN_USERNAME or not check_password_hash(correct_hashed_password, password):
            return jsonify({"error": "Invalid credentials"}), 401

        return jsonify({"message": "Login successful!", "token": "admin-token"})

    except Exception as e:
        print("Admin Login Error:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500
    
@admin_bp.route("/stats", methods=["GET"])
def admin_stats():
    student_count = User.query.filter_by(role="student").count()
    course_count = Course.query.count()
    students = User.query.filter_by(role="student").all()

    student_list = [{"university_id": s.university_id, "first_name": s.first_name, "last_name": s.last_name} for s in students]

    return jsonify({
        "total_students": student_count,
        "total_courses": course_count,
        "students": student_list
    })

@admin_bp.route("/change-role", methods=["POST"])
def change_role():
    data = request.json
    university_id = data.get("university_id")

    user = User.query.filter_by(university_id=university_id, role="student").first()
    if not user:
        return jsonify({"error": "Student not found"}), 404

    user.role = "instructor"
    db.session.commit()

    return jsonify({"message": "Student role updated to Instructor"})