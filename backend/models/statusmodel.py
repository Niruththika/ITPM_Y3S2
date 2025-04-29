from datetime import datetime
from bson import ObjectId

class OrderModel:
    """Model for representing order data"""
    
    def __init__(self, mongo):
        self.db = mongo.db
        self.collection = self.db.orders

    def serialize_order(self, order):
        """Convert MongoDB document to JSON serializable format"""
        if order:
            return {
                "_id": str(order["_id"]),
                "id": order.get("id", ""),
                "name": order.get("name", ""),
                "email": order.get("email", ""),
                "status": order.get("status", ""),
                "currentLocation": order.get("currentLocation", ""),
                "arrival": order.get("arrival", ""),
                "created_at": order.get("created_at", datetime.now()).isoformat(),
                "updated_at": order.get("updated_at", datetime.now()).isoformat()
            }
        return None

    def get_all_orders(self):
        """Get all orders from the database"""
        orders = self.collection.find().sort("created_at", -1)
        return [self.serialize_order(order) for order in orders]

    def get_order_by_id(self, order_id):
        """Get a single order by its ID"""
        try:
            order = self.collection.find_one({"_id": ObjectId(order_id)})
            return self.serialize_order(order)
        except Exception as e:
            print(f"Error fetching order: {e}")
            return None

    def validate_required_fields(self, data, required_fields):
        """Check for required fields"""
        missing = [field for field in required_fields if not data.get(field)]
        if missing:
            raise ValueError(f"Missing required fields: {', '.join(missing)}")

    def create_order(self, order_data):
        """Create a new order with validation"""
        try:
            # Validate required fields
            self.validate_required_fields(order_data, ["name", "email", "currentLocation", "arrival"])

            # Generate a new order ID (format: #001, #002, etc.)
            last_order = self.collection.find_one(sort=[("id", -1)])
            new_id = "#001"

            if last_order and "id" in last_order:
                try:
                    last_id = int(last_order["id"].replace("#", ""))
                    new_id = f"#{(last_id + 1):03d}"
                except ValueError:
                    pass

            # Prepare order document
            order_doc = {
                "id": new_id,
                "name": order_data.get("name"),
                "email": order_data.get("email"),
                "status": order_data.get("status", "Pending"),
                "currentLocation": order_data.get("currentLocation"),
                "arrival": order_data.get("arrival"),
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }

            result = self.collection.insert_one(order_doc)
            return self.get_order_by_id(result.inserted_id)

        except Exception as e:
            print(f"Error creating order: {e}")
            return None

    def update_order(self, order_id, update_data):
        """Update an existing order with basic validation"""
        try:
            if not update_data:
                raise ValueError("No update data provided.")

            allowed_fields = ["name", "email", "status", "currentLocation", "arrival"]
            update_doc = {
                k: update_data[k] for k in allowed_fields if k in update_data and update_data[k] is not None
            }

            if not update_doc:
                raise ValueError("No valid fields provided for update.")

            update_doc["updated_at"] = datetime.now()

            result = self.collection.update_one(
                {"_id": ObjectId(order_id)},
                {"$set": update_doc}
            )

            if result.modified_count > 0:
                return self.get_order_by_id(order_id)
            return None
        except Exception as e:
            print(f"Error updating order: {e}")
            return None

    def delete_order(self, order_id):
        """Delete an order"""
        try:
            result = self.collection.delete_one({"_id": ObjectId(order_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting order: {e}")
            return False
