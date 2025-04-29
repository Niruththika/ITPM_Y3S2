from flask import Blueprint, jsonify
from flask_jwt_extended import unset_jwt_cookies

logout_bp = Blueprint("logout", __name__)

@logout_bp.route("/logout", methods=["GET"])
def logout():
    response = jsonify({"message": "Logged out", "success": True})
    unset_jwt_cookies(response)
    print("Logged out")
    return response
