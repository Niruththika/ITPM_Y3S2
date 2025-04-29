from flask import Blueprint, request, jsonify
from models.product_model import ProductModel

update_product_bp = Blueprint("update_product", __name__)

@update_product_bp.route("/update-product", methods=["PATCH"])
def update_product():
    try:
        product_id = request.json.get("_id")
        if not product_id:
            return jsonify({"message": "Product ID required", "success": False}), 400

        update_data = request.json.get("update_data")
        if ProductModel.update_product(product_id, update_data):
            return jsonify({"message": "Product updated successfully", "success": True}), 200
        return jsonify({"message": "Product not found or no changes made", "success": False}), 404
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400