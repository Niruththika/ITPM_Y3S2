from flask import Blueprint, request, jsonify
from models.cartProduct import CartProductModel
from flask_jwt_extended import jwt_required, get_jwt_identity

update_cart_bp = Blueprint("update_cart", __name__)

@update_cart_bp.route("/update-cart", methods=["PATCH"])
@jwt_required()
def update_cart():
    try:
        cart_item_id = request.json.get("_id")
        quantity = request.json.get("quantity")
        if not cart_item_id or quantity is None:
            return jsonify({"message": "Cart item ID and quantity required", "success": False}), 400

        user_id = get_jwt_identity()
        if CartProductModel.update_cart_item(cart_item_id, user_id, quantity):
            return jsonify({"message": "Cart updated", "success": True}), 200
        return jsonify({"message": "Item not found", "success": False}), 404
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400