from flask import Blueprint
from controllers.statuscontrol import OrderController

def create_order_routes(mongo):
    """Create order-related routes"""
    order_bp = Blueprint('orders', __name__)
    order_controller = OrderController(mongo)
    
    # Get all orders
    @order_bp.route('/api/orders', methods=['GET'])
    def get_orders():
        return order_controller.get_all_orders()
    
    # Get a single order
    @order_bp.route('/api/orders/<order_id>', methods=['GET'])
    def get_order(order_id):
        return order_controller.get_order_by_id(order_id)
    
    # Create a new order
    @order_bp.route('/api/orders', methods=['POST'])
    def create_order():
        return order_controller.create_order()
    
    # Update an order
    @order_bp.route('/api/orders/<order_id>', methods=['PUT'])
    def update_order(order_id):
        return order_controller.update_order(order_id)
    
    # Delete an order
    @order_bp.route('/api/orders/<order_id>', methods=['DELETE'])
    def delete_order(order_id):
        return order_controller.delete_order(order_id)
    
    return order_bp