from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from config.config import Config
from config.db import init_db
from routes.product_routes import product_routes
from routes.user_routes import user_routes
#from routes.orderchangerout import register_order_routes
# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)

# Load Configurations
app.config.from_object(Config)

# Enable CORS
CORS(app, origins=Config.FRONTEND_URL, supports_credentials=True, methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"])


# Initialize Database
mongo = init_db(app)

# Initialize JWT
jwt = JWTManager(app)

# Register Routes
app.register_blueprint(product_routes, url_prefix="/api/products")
app.register_blueprint(user_routes, url_prefix="/api/users")

@app.route("/")
def home():
    return {"message": "Flask MongoDB API Running", "success": True}


if __name__ == "__main__":
    PORT = int(os.getenv("PORT", 5000))
    app.run(debug=Config.DEBUG, host="0.0.0.0", port=PORT)