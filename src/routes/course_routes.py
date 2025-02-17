from flask import Blueprint, request, jsonify
from models import db, Course

course_bp = Blueprint('courses', __name__)

@course_bp.route('/add', methods=['POST'])
def add_course():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    created_by = data.get('created_by')  # Must be a valid `university_id`

    if not title or not description or not created_by:
        return jsonify({"error": "Missing required fields"}), 400

    new_course = Course(title=title, description=description, created_by=created_by)
    db.session.add(new_course)
    db.session.commit()

    return jsonify({"message": "Course added successfully!", "course_id": new_course.course_id})