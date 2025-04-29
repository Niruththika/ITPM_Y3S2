from config.db import mongo
from bson import ObjectId

def check_admin(user_id):
    """Check if a user has admin privileges."""
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        return user and user.get("role") == "ADMIN"
    except Exception:
        return False  # Invalid ID or DB error