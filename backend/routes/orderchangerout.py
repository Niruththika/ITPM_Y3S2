from flask import Blueprint
from controllers.orderchangecontrol import OrderController

# Create a Blueprint for order routes
order_routes = Blueprint('order_routes', __name__)

# Order routes
order_routes.route('/api/orders', methods=['POST'])(OrderController.create_order)
order_routes.route('/api/orders/my-orders', methods=['GET'])(OrderController.get_customer_orders)
order_routes.route('/api/orders/product/<product_id>', methods=['GET'])(OrderController.get_customer_product_orders)
order_routes.route('/api/orders/<order_id>', methods=['GET'])(OrderController.get_order_details)
order_routes.route('/api/orders/<order_id>/status', methods=['PUT'])(OrderController.update_order_status)
order_routes.route('/api/orders', methods=['GET'])(OrderController.get_all_orders)

# Function to register routes with the Flask app
def register_order_routes(app):
    app.register_blueprint(order_routes)
    print("✅ Order routes registered")