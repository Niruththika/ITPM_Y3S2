from config.db import mongo
from bson import ObjectId
from datetime import datetime

class ProductModel:
    """Model class for handling product-related MongoDB operations."""
    COLLECTION = "products"

    @staticmethod
    def create_product(product_data: dict) -> dict:
        """Create a new product and insert it into the database."""
        product = {
            "productName": product_data.get("productName"),
            "brandName": product_data.get("brandName"),
            "category": product_data.get("category"),
            "productImage": product_data.get("productImage", []),
            "description": product_data.get("description"),
            "price": float(product_data.get("price", 0)),
            "sellingPrice": float(product_data.get("sellingPrice", 0)),
            "created_at": datetime.utcnow()
        }
        result = mongo.db[ProductModel.COLLECTION].insert_one(product)
        product["_id"] = str(result.inserted_id)
        return product

    @staticmethod
    def find_by_id(product_id: str) -> dict | None:
        """Find a product by its ID."""
        try:
            product = mongo.db[ProductModel.COLLECTION].find_one({"_id": ObjectId(product_id)})
            if product:
                product["_id"] = str(product["_id"])
            return product
        except Exception as e:
            print(f"Error finding product by ID: {e}")
            return None

    @staticmethod
    def get_all_products() -> list:
        """Retrieve all products, sorted by creation date (newest first)."""
        products = list(mongo.db[ProductModel.COLLECTION].find().sort("created_at", -1))
        for product in products:
            product["_id"] = str(product["_id"])
        return products

    @staticmethod
    def get_distinct_categories() -> list:
        """Retrieve all unique product categories."""
        return mongo.db[ProductModel.COLLECTION].distinct("category")

    @staticmethod
    def get_one_per_category() -> list:
        """Retrieve one product per category."""
        categories = ProductModel.get_distinct_categories()
        products = []
        for category in categories:
            product = mongo.db[ProductModel.COLLECTION].find_one({"category": category})
            if product:
                product["_id"] = str(product["_id"])
                products.append(product)
        return products

    @staticmethod
    def search_products(query: str) -> list:
        """Search products by name or category."""
        regex_query = {"$regex": query, "$options": "i"}
        products = list(mongo.db[ProductModel.COLLECTION].find({
            "$or": [{"productName": regex_query}, {"category": regex_query}]
        }))
        for product in products:
            product["_id"] = str(product["_id"])
        return products

    @staticmethod
    def filter_by_categories(category_list: list) -> list:
        """Retrieve products that belong to the specified categories."""
        products = list(mongo.db[ProductModel.COLLECTION].find({"category": {"$in": category_list}}))
        for product in products:
            product["_id"] = str(product["_id"])
        return products

    @staticmethod
    def get_by_category(category: str) -> list:
        """Retrieve all products in a specific category."""
        products = list(mongo.db[ProductModel.COLLECTION].find({"category": category}))
        for product in products:
            product["_id"] = str(product["_id"])
        return products

    @staticmethod
    def update_product(product_id: str, update_data: dict) -> bool:
        """Update an existing product."""
        try:
            result = mongo.db[ProductModel.COLLECTION].update_one(
                {"_id": ObjectId(product_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating product: {e}")
            return False
    
    @staticmethod
    def delete_product(product_id: str) -> bool:
        """Delete a product by its ID."""
        from bson import ObjectId
        try:
            result = mongo.db[ProductModel.COLLECTION].delete_one({"_id": ObjectId(product_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting product: {e}")
            return False
