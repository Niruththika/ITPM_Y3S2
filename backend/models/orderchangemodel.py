# models/orderchangemodel.py
from bson import ObjectId
from config.db import mongo
from datetime import datetime

class OrderChangeModel:
    """Model for handling order change operations in MongoDB."""

    @staticmethod
    def create_order(data):
        """Create a new order with required field validation."""
        required_fields = ["color", "size", "add", "quan"]
        for field in required_fields:
            if field not in data or data[field] in [None, ""]:
                raise ValueError(f"'{field}' is a required field and cannot be empty.")

        order = {
            "color": data["color"],
            "size": data["size"],
            "add": data["add"],
            "quan": data["quan"],
            "created_at": datetime.utcnow()
        }

        result = mongo.db.orderchange.insert_one(order)
        return str(result.inserted_id) if result.acknowledged else None

    @staticmethod
    def get_all_orders():
        """Retrieve all orders."""
        orders = mongo.db.orderchange.find()
        result = []
        for order in orders:
            order["_id"] = str(order["_id"])
            result.append(order)
        return result

    @staticmethod
    def delete_order(order_id):
        """Delete an order by ID."""
        try:
            order_id = ObjectId(order_id)
            result = mongo.db.orderchange.delete_one({"_id": order_id})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting order: {e}")
            return False

    @staticmethod
    def update_order(order_id, data):
        """Update an order by ID with required field validation."""
        try:
            order_id = ObjectId(order_id)

            required_fields = ["color", "size", "add", "quan"]
            for field in required_fields:
                if field not in data or data[field] in [None, ""]:
                    raise ValueError(f"'{field}' is a required field and cannot be empty.")

            update_data = {
                "color": data["color"],
                "size": data["size"],
                "add": data["add"],
                "quan": data["quan"],
                "updated_at": datetime.utcnow()
            }

            result = mongo.db.orderchange.update_one(
                {"_id": order_id},
                {"$set": update_data}
            )

            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating order: {e}")
            return False
