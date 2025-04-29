from flask import Blueprint, request, jsonify
from models.product_model import ProductModel

filter_product_bp = Blueprint("filter_product", __name__)

@filter_product_bp.route("/filter-product", methods=["POST"])
def filter_product():
    try:
        category_list = request.json.get("category", [])
        if not category_list:
            return jsonify({"message": "Category list required", "success": False}), 400

        products = ProductModel.filter_by_categories(category_list)
        return jsonify({"data": products, "message": "Filtered products", "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400