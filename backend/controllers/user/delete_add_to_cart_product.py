from flask import Blueprint, request, jsonify
from models.cartProduct import CartProductModel
from flask_jwt_extended import jwt_required, get_jwt_identity

delete_cart_bp = Blueprint("delete_cart", __name__)

@delete_cart_bp.route("/delete-cart", methods=["post"])
@jwt_required()
def delete_cart():
    try:
        cart_item_id = request.json.get("_id")
        if not cart_item_id:
            return jsonify({"message": "Cart item ID required", "success": False}), 400

        user_id = get_jwt_identity()
        if CartProductModel.delete_cart_item(cart_item_id, user_id):
            return jsonify({"message": "Removed from cart", "success": True}), 200
        return jsonify({"message": "Item not found", "success": False}), 404
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400