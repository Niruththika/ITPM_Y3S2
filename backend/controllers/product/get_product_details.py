from flask import Blueprint, request, jsonify
from models.product_model import ProductModel

get_product_details_bp = Blueprint("get_product_details", __name__)

@get_product_details_bp.route("/product-details", methods=["POST"])
def get_product_details():
    try:
        product_id = request.json.get("productId")
        if not product_id:
            return jsonify({"message": "Product ID required", "success": False}), 400

        product = ProductModel.find_by_id(product_id)
        if not product:
            return jsonify({"message": "Product not found", "success": False}), 404

        return jsonify({"data": product, "message": "Product details", "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400