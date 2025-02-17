from flask import Blueprint, jsonify
from models import db, Course

course_bp = Blueprint('courses', __name__)

@course_bp.route('/', methods=['GET'])
def get_courses():
    courses = Course.query.all()
    course_list = [{"id": c.course_id, "title": c.title, "description": c.description} for c in courses]
    return jsonify({"courses": course_list})