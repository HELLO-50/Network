from flask import Blueprint, jsonify
from models import db, User  # Ensure models are correctly imported

dbtest_bp = Blueprint('dbtest', __name__)

@dbtest_bp.route('/dbtest')
def test_db():
    # Explicitly use `db` to avoid warnings
    with db.session() as session:
        user = session.query(User).first()

    if user:
        return jsonify({"message": "Database connected!", "user": user.first_name})

    return jsonify({"message": "No users found!"})