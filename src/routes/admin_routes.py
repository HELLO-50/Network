from flask import Blueprint, jsonify

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/delete-user', methods=['DELETE'])
def delete_user():
    return jsonify({"message": "User deleted successfully!"})