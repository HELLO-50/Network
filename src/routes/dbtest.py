from flask import Blueprint, jsonify
from models import db, User

test_db = Blueprint('test_db', __name__)

@test_db.route('/test-db')
def test_database():
    user = User.query.first()
    if user:
        return jsonify({"message": "Database connected!", "user": user.first_name})
    return jsonify({"message": "No users found!"})