from flask import Blueprint, jsonify
from config.db import mongo

get_category_product_bp = Blueprint("get_category_product", __name__)

@get_category_product_bp.route("/get-category-product", methods=["GET"])
def get_category_product():
    try:
        product_categories = mongo.db.products.distinct("category")
        product_by_category = []

        for category in product_categories:
            product = mongo.db.products.find_one({"category": category})
            if product:
                product["_id"] = str(product["_id"])
                product_by_category.append(product)

        return jsonify({"message": "Category products", "data": product_by_category, "success": True}), 200

    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400
