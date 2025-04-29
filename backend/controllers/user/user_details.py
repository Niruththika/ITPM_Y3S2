from flask import Blueprint, jsonify
from models.user_model import UserModel
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

user_details_bp = Blueprint("user_details", __name__)

@user_details_bp.route("/user-details", methods=["GET"])
@jwt_required()
def user_details():
    try:
        user_id = get_jwt_identity()
        print("User ID: ",user_id)
        jwt_data=get_jwt()
        print("JWT Data: ", jwt_data)
        user = UserModel.find_by_id(user_id)
        if not user:
            return jsonify({"message": "User not found", "success": False}), 404

        del user["password"]  # Ensure password is excluded
        return jsonify({"data": user, "message": "User details", "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400