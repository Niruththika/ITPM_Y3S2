from flask import Blueprint, request, jsonify
from models.product_model import ProductModel

delete_product_bp = Blueprint("delete_product", __name__)

@delete_product_bp.route("/delete-product", methods=["DELETE"])
def delete_product():
    try:
        product_id = request.json.get("_id")
        if not product_id:
            return jsonify({"message": "Product ID required", "success": False}), 400

        if ProductModel.delete_product(product_id):
            return jsonify({"message": "Product deleted successfully", "success": True}), 200
        return jsonify({"message": "Product not found", "success": False}), 404
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400
