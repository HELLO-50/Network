from flask import Blueprint, jsonify

course_bp = Blueprint('courses', __name__)

@course_bp.route('/', methods=['GET'])
def get_courses():
    return jsonify({"courses": ["Course 1", "Course 2", "Course 3"]})