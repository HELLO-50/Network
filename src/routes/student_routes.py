from flask import Blueprint, jsonify

student_bp = Blueprint('students', __name__)

@student_bp.route('/progress', methods=['GET'])
def student_progress():
    return jsonify({"progress": "80% completed"})