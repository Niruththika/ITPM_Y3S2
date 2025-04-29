from flask_pymongo import PyMongo
from flask import Flask
from config.config import Config

# Initialize MongoDB
mongo = PyMongo()

def init_db(app: Flask):
    """Initialize MongoDB with Flask app."""
    app.config["MONGO_URI"] = Config.MONGO_URI
    mongo.init_app(app)
    print("✅ Connected to MongoDB")
    return mongo