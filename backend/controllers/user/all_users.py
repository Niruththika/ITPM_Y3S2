from flask import Blueprint, jsonify
from models.user_model import UserModel
from flask_jwt_extended import jwt_required, get_jwt_identity

all_users_bp = Blueprint("all_users", __name__)

@all_users_bp.route("/all-users", methods=["GET"])
@jwt_required()
def all_users():
    try:
        if not UserModel.is_admin(get_jwt_identity()):
            return jsonify({"message": "Access denied", "success": False}), 403

        users = UserModel.get_all_users()
        return jsonify({"data": users, "message": "All users", "success": True}), 200

    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400