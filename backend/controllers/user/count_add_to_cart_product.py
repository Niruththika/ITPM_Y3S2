from flask import Blueprint, jsonify
from models.cartProduct import CartProductModel
from flask_jwt_extended import jwt_required, get_jwt_identity

count_cart_bp = Blueprint("count_cart", __name__)

@count_cart_bp.route("/count-cart", methods=["GET"])
@jwt_required()
def count_cart():
    try:
        user_id = get_jwt_identity()
        count = CartProductModel.count_cart_items(user_id)
        return jsonify({"data": {"count": count}, "message": "Cart count", "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400