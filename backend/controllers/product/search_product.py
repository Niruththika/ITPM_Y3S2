from flask import Blueprint, request, jsonify
from models.product_model import ProductModel

search_product_bp = Blueprint("search_product", __name__)

@search_product_bp.route("/search-product", methods=["GET"])
def search_product():
    try:
        query = request.args.get("q", "")
        products = ProductModel.search_products(query)
        return jsonify({"data": products, "message": "Search results", "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400