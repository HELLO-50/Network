from flask import Blueprint, jsonify, request
from models import db, Progress

student_bp = Blueprint('students', __name__)

@student_bp.route('/progress', methods=['GET'])
def student_progress():
    university_id = request.args.get('university_id')  # Get student ID from request

    if not university_id:
        return jsonify({"error": "Missing student ID"}), 400

    progress = Progress.query.filter_by(university_id=university_id).all()
    progress_list = [{"course_id": p.course_id, "module_completed": p.module_completed, "completed_at": p.completed_at} for p in progress]

    return jsonify({"progress": progress_list})