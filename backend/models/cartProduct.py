from config.db import mongo
from bson import ObjectId
from datetime import datetime

class CartProductModel:
    """Model class for cart product-related MongoDB operations."""
    
    COLLECTION = "cart"

    @staticmethod
    def add_to_cart(user_id: str, product_id: str, quantity: int = 1) -> dict:
        """Add a product to a user's cart."""
        existing_item = mongo.db[CartProductModel.COLLECTION].find_one({
            "userId": user_id,
            "productId": product_id
        })
        if existing_item:
            return None  # Indicates item already exists
        
        cart_item = {
            "userId": user_id,
            "productId": product_id,
            "quantity": quantity,
            "created_at": datetime.utcnow()
        }
        result = mongo.db[CartProductModel.COLLECTION].insert_one(cart_item)
        cart_item["_id"] = str(result.inserted_id)
        return cart_item

    # @staticmethod
    # def get_user_cart(user_id: str) -> list:
    #     """Get all cart items for a user."""
    #     cart_items = list(mongo.db[CartProductModel.COLLECTION].find({"userId": user_id}))
    #     print(cart_items)
    #     for item in cart_items:
    #         item["_id"] = str(item["_id"])
    #     return cart_items
    @staticmethod
    def get_user_cart(user_id: str) -> list:
        """Get all cart items for a user and replace productId with product details."""
        cart_items = list(mongo.db[CartProductModel.COLLECTION].find({"userId": user_id}))
        
        # Collect valid product ids from the productId field in cart items
        product_ids = []
        for item in cart_items:
            item["_id"] = str(item["_id"])
            product_id = item.get("productId")
            print("product_id", product_id)
            if product_id:
                try:
                    product_ids.append(ObjectId(product_id))
                except Exception as e:
                    print(f"Error converting productId {product_id}: {e}")
        
        # Query all products whose _id is in product_ids
        products_cursor = mongo.db["products"].find({"_id": {"$in": product_ids}})
        # Create a mapping from product _id (as string) to product details
        product_map = {}
        for product in products_cursor:
            product_id_str = str(product["_id"])
            product["_id"] = product_id_str
            product_map[product_id_str] = product

        # Replace the productId field in each cart item with selected product properties
        for item in cart_items:
            product_id = item.get("productId")
            if product_id and product_id in product_map:
                product = product_map[product_id]
                item["productId"] = {
                    "productName": product.get("productName"),
                    "category": product.get("category"),
                    "productImage": product.get("productImage"),
                    "sellingPrice": product.get("sellingPrice")
                }
        
        print("cart_items", cart_items)  
        return cart_items

    @staticmethod
    def count_cart_items(user_id: str) -> int:
        """Count items in a user's cart."""
        return mongo.db[CartProductModel.COLLECTION].count_documents({"userId": user_id})

    @staticmethod
    def update_cart_item(cart_item_id: str, user_id: str, quantity: int) -> bool:
        """Update a cart item's quantity."""
        try:
            result = mongo.db[CartProductModel.COLLECTION].update_one(
                {"_id": ObjectId(cart_item_id), "userId": user_id},
                {"$set": {"quantity": quantity}}
            )
            return result.matched_count > 0
        except Exception:
            return False

    @staticmethod
    def delete_cart_item(cart_item_id: str, user_id: str) -> bool:
        """Delete a cart item."""
        try:
            result = mongo.db[CartProductModel.COLLECTION].delete_one(
                {"_id": ObjectId(cart_item_id), "userId": user_id}
            )
            return result.deleted_count > 0
        except Exception:
            return False