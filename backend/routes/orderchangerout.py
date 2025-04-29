# routes/orderchangerout.py
from flask import Blueprint
from controllers.orderchangecontrol import OrderChangeController

# Create Blueprint
order_routes = Blueprint("order_routes", __name__)

# Define routes
@order_routes.route("/", methods=["GET"])
def get_all_orders():
    """Route to get all orders."""
    return OrderChangeController.get_all_orders()

@order_routes.route("/create", methods=["POST"])
def create_order():
    """Route to create a new order."""
    return OrderChangeController.create_order()

@order_routes.route("/delete/<order_id>", methods=["DELETE"])
def delete_order(order_id):
    """Route to delete an order by ID."""
    return OrderChangeController.delete_order(order_id)


@order_routes.route("/update/<order_id>", methods=["PUT"])
def update_order(order_id):
    """Route to update an order by ID."""
    return OrderChangeController.update_order(order_id)


def register_order_routes(app):
    """Register order routes with the Flask app."""
    app.register_blueprint(order_routes, url_prefix="/")