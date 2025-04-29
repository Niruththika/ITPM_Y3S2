from flask import Blueprint, jsonify
from models.cartProduct import CartProductModel
from flask_jwt_extended import jwt_required, get_jwt_identity

view_cart_bp = Blueprint("view_cart", __name__)

@view_cart_bp.route("/view-cart", methods=["GET"])
@jwt_required()
def view_cart():
    try:
        user_id = get_jwt_identity()
        cart_items = CartProductModel.get_user_cart(user_id)
        print(cart_items)
        return jsonify({"data": cart_items, "message": "Cart items", "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400