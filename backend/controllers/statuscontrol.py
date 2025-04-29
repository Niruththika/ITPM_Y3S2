from flask import request, jsonify
from models.statusmodel import OrderModel

class OrderController:
    """Controller for handling order-related operations"""
    
    def __init__(self, mongo):
        self.order_model = OrderModel(mongo)
    
    def get_all_orders(self):
        """Get all orders"""
        orders = self.order_model.get_all_orders()
        return jsonify(orders), 200
    
    def get_order_by_id(self, order_id):
        """Get a single order by ID"""
        order = self.order_model.get_order_by_id(order_id)
        
        if order:
            return jsonify(order), 200
        return jsonify({"error": "Order not found"}), 404
    
    def create_order(self):
        """Create a new order"""
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            # Basic validation
            if not data.get("email"):
                return jsonify({"error": "Email is required"}), 400
            
            order = self.order_model.create_order(data)
            
            if order:
                return jsonify(order), 201
            return jsonify({"error": "Failed to create order"}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def update_order(self, order_id):
        """Update an existing order"""
        try:
            data = request.get_json()
            
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            updated_order = self.order_model.update_order(order_id, data)
            
            if updated_order:
                return jsonify(updated_order), 200
            return jsonify({"error": "Order not found or not updated"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def delete_order(self, order_id):
        """Delete an order"""
        try:
            success = self.order_model.delete_order(order_id)
            
            if success:
                return jsonify({"message": "Order deleted successfully"}), 200
            return jsonify({"error": "Order not found or not deleted"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500