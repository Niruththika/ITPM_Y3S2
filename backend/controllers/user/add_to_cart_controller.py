from flask import Blueprint, request, jsonify
from models.cartProduct import CartProductModel
from flask_jwt_extended import jwt_required, get_jwt_identity

add_to_cart_bp = Blueprint("add_to_cart", __name__)

@add_to_cart_bp.route("/add-to-cart", methods=["POST"])
@jwt_required()
def add_to_cart():
    try:
        product_id = request.json.get("productId")
        print("Product ID: ", product_id)
        if not product_id:
            return jsonify({"message": "Product ID required", "success": False}), 400

        user_id = get_jwt_identity()
        cart_item = CartProductModel.add_to_cart(user_id, product_id)
        if not cart_item:
            return jsonify({"message": "Product already in cart", "success": False}), 400

        return jsonify({"message": "Added to cart", "success": True, "data": cart_item}), 201
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400