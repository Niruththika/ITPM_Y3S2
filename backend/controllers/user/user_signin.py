from flask import Blueprint, request, jsonify
from models.user_model import UserModel
from flask_jwt_extended import create_access_token
import datetime

user_signin_bp = Blueprint("user_signin", __name__)

@user_signin_bp.route("/signin", methods=["POST"])
def signin():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Missing required fields", "success": False}), 400

        user = UserModel.find_by_email(email)
        if not user:
            return jsonify({"message": "User not found", "success": False}), 404

        if not UserModel.verify_password(user, password):
            return jsonify({"message": "Incorrect password", "success": False}), 401

        access_token = create_access_token(
            identity=user["_id"],
            expires_delta=datetime.timedelta(days=1)
        )
        return jsonify({"message": "Login successful", "success": True, "token": access_token}), 200

    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400