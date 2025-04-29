from flask import Blueprint, request, jsonify
from config.db import mongo
from werkzeug.security import generate_password_hash
import re
from datetime import datetime

user_signup_bp = Blueprint("user_signup", __name__)

@user_signup_bp.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")

        if not email or not password or not name:
            return jsonify({"message": "Missing required fields", "success": False}), 400

        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return jsonify({"message": "Invalid email format", "success": False}), 400

        if mongo.db.users.find_one({"email": email}):
            return jsonify({"message": "User already exists", "success": False}), 400

        hashed_password = generate_password_hash(password)

        new_user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": "GENERAL",  
            "created_at": datetime.utcnow()
        }
        mongo.db.users.insert_one(new_user)

        return jsonify({"message": "User created successfully", "success": True}), 201

    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400