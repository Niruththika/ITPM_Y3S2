from flask import Blueprint, jsonify
from models.product_model import ProductModel

get_product_bp = Blueprint("get_product", __name__)

@get_product_bp.route("/get-product", methods=["GET"])
def get_product():
    try:
        products = ProductModel.get_all_products()
        print("products:", products)
        return jsonify({"message": "All products", "data": products, "success": True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400