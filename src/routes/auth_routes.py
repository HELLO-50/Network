from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    university_id = data.get('university_id')
    password = data.get('password')

    if not university_id or not password:
        return jsonify({"error": "Missing credentials"}), 400

    user = User.query.filter_by(university_id=university_id).first()

    if user and check_password_hash(user.password, password):
        return jsonify({"message": "Login successful!", "user": {"id": user.university_id, "name": user.first_name}})
    else:
        return jsonify({"error": "Invalid credentials"}), 401