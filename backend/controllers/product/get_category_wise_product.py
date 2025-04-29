from flask import Blueprint, request, jsonify
from config.db import mongo

get_category_wise_product_bp = Blueprint("get_category_wise_product", __name__)

@get_category_wise_product_bp.route("/category-product", methods=["POST"])
def get_category_wise_product():
    try:
        category = request.json.get("category")
        products = list(mongo.db.products.find({"category": category}))
        
        for product in products:
            product["_id"] = str(product["_id"])

        return jsonify({"data": products, "message": "Products in category", "success": True}), 200

    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400
