from flask import Blueprint
from controllers.product.get_product import get_product_bp
from controllers.product.upload_product import upload_product_bp
from controllers.product.filter_product import filter_product_bp
from controllers.product.get_product_details import get_product_details_bp
from controllers.product.get_category_product_one import get_category_product_bp
from controllers.product.get_category_wise_product import get_category_wise_product_bp
from controllers.product.search_product import search_product_bp
from controllers.product.update_product import update_product_bp
from controllers.product.delete_product import delete_product_bp

product_routes = Blueprint("product_routes", __name__)

# Register product-related endpoints
product_routes.register_blueprint(get_product_bp, url_prefix="/product")
product_routes.register_blueprint(upload_product_bp, url_prefix="/product")
product_routes.register_blueprint(filter_product_bp, url_prefix="/product")
product_routes.register_blueprint(get_product_details_bp, url_prefix="/product")
product_routes.register_blueprint(get_category_product_bp, url_prefix="/product")
product_routes.register_blueprint(get_category_wise_product_bp, url_prefix="/product")
product_routes.register_blueprint(search_product_bp, url_prefix="/product")
product_routes.register_blueprint(update_product_bp, url_prefix="/product")
product_routes.register_blueprint(delete_product_bp, url_prefix="/product")

