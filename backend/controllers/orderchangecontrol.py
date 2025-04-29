# controllers/orderchangecontrol.py
from flask import request, jsonify
from models.orderchangemodel import OrderChangeModel

class OrderChangeController:
    """Controller for handling order change operations."""

    @staticmethod
    def create_order():
        """Create a new order."""
        try:
            data = request.get_json()
            
            # Validate required fields
            if not all(key in data for key in ["color", "size", "add", "quan"]):
                return jsonify({"success": False, "message": "Missing required fields"}), 400
            
            # Validate quan is a positive integer
            try:
                quan = int(data["quan"])
                if quan <= 0:
                    return jsonify({"success": False, "message": "Quantity must be positive"}), 400
                data["quan"] = quan
            except ValueError:
                return jsonify({"success": False, "message": "Quantity must be a number"}), 400
            
            # Create order
            order_id = OrderChangeModel.create_order(data)
            if order_id:
                return jsonify({
                    "success": True,
                    "message": "Order created successfully",
                    "order_id": order_id
                }), 201
            else:
                return jsonify({"success": False, "message": "Failed to create order"}), 500
        
        except Exception as e:
            print(f"Error creating order: {e}")
            return jsonify({"success": False, "message": "Server error"}), 500

    @staticmethod
    def get_all_orders():
        """Retrieve all orders."""
        try:
            orders = OrderChangeModel.get_all_orders()
            return jsonify({"success": True, "data": orders}), 200
        
        except Exception as e:
            print(f"Error retrieving orders: {e}")
            return jsonify({"success": False, "message": "Server error"}), 500

    @staticmethod
    def delete_order(order_id):
        """Delete an order by ID."""
        try:
            if OrderChangeModel.delete_order(order_id):
                return jsonify({"success": True, "message": "Order deleted successfully"}), 200
            else:
                return jsonify({"success": False, "message": "Order not found"}), 404
        
        except Exception as e:
            print(f"Error deleting order: {e}")
            return jsonify({"success": False, "message": "Server error"}), 500
        
    
    @staticmethod
    def update_order(order_id):
      """Update an existing order."""
      try:
        data = request.get_json()
        
        # Validate that at least one field to update is provided
        if not any(key in data for key in ["color", "size", "add", "quan"]):
            return jsonify({"success": False, "message": "No fields to update provided"}), 400
        
        # Validate quan if it's provided
        if "quan" in data:
            try:
                quan = int(data["quan"])
                if quan <= 0:
                    return jsonify({"success": False, "message": "Quantity must be positive"}), 400
                data["quan"] = quan
            except ValueError:
                return jsonify({"success": False, "message": "Quantity must be a number"}), 400
        
        # Update order
        if OrderChangeModel.update_order(order_id, data):
            return jsonify({
                "success": True,
                "message": "Order updated successfully"
            }), 200
        else:
            return jsonify({"success": False, "message": "Order not found or no changes made"}), 404
    
      except Exception as e:
        print(f"Error updating order: {e}")
        return jsonify({"success": False, "message": "Server error"}), 500