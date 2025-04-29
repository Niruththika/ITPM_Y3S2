from flask import Blueprint, request, jsonify
from models.product_model import ProductModel

upload_product_bp = Blueprint("upload_product", __name__)

@upload_product_bp.route("/upload-product", methods=["POST"])
def upload_product():
    try:
        product_data = request.json
        required_fields = ["productName", "price", "sellingPrice"]
        print("product_data", product_data)
        if not all(field in product_data for field in required_fields):
            return jsonify({"message": "Missing required fields", "success": False}), 400
        
        product = ProductModel.create_product(product_data)
        return jsonify({"message": "Product uploaded successfully", "success": True, "productId": product["_id"]}), 201
    except Exception as e:
        return jsonify({"message": str(e), "success": False}), 400