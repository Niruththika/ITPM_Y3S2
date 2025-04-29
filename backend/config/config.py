import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Configuration settings for the Flask application."""
    
    # Flask settings
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")  # Replace with a secure random key (e.g., os.urandom(24).hex())
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"  # Convert string to boolean
    
    # MongoDB settings
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/mydatabase")
    
    # JWT settings
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")  # Replace with a secure random key
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 86400))  # Default 24h
    
    # CORS settings
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")