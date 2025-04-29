from flask import Blueprint
from controllers.user.user_signup import user_signup_bp
from controllers.user.user_signin import user_signin_bp
from controllers.user.user_details import user_details_bp
from controllers.user.add_to_cart_controller import add_to_cart_bp
from controllers.user.add_to_cart_view_product import view_cart_bp
from controllers.user.delete_add_to_cart_product import delete_cart_bp
from controllers.user.all_users import all_users_bp
from controllers.user.update_user import update_user_bp
from controllers.user.user_logout import logout_bp  # Updated to match file name
from controllers.user.update_add_to_cart_product import update_cart_bp
from controllers.user.count_add_to_cart_product import count_cart_bp

user_routes = Blueprint("user_routes", __name__)

# Register user-related endpoints
user_routes.register_blueprint(user_signup_bp, url_prefix="/user")
user_routes.register_blueprint(user_signin_bp, url_prefix="/user")
user_routes.register_blueprint(user_details_bp, url_prefix="/user")
user_routes.register_blueprint(add_to_cart_bp, url_prefix="/user")
user_routes.register_blueprint(view_cart_bp, url_prefix="/user")
user_routes.register_blueprint(delete_cart_bp, url_prefix="/user")
user_routes.register_blueprint(all_users_bp, url_prefix="/user")
user_routes.register_blueprint(update_user_bp, url_prefix="/user")
user_routes.register_blueprint(logout_bp, url_prefix="/user")
user_routes.register_blueprint(update_cart_bp, url_prefix="/user")
user_routes.register_blueprint(count_cart_bp, url_prefix="/user")