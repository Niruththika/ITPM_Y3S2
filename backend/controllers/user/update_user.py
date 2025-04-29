from flask import Blueprint, request, jsonify
from models.user_model import UserModel
from flask_jwt_extended import jwt_required, get_jwt_identity

update_user_bp = Blueprint("update_user", __name__)

@update_user_bp.route("/update-user", methods=["PATCH"])
@jwt_required()
def update_user():
    try:
        user_id = get_jwt_identity()
        update_data = request.json

        if UserModel.update_user(user_id, update_data):
            return jsonify({"message": "User updated", "success": True}), 200
        return jsonify({"message": "User not found or no changes made", "success": False}), 404

    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400