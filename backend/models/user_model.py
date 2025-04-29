from config.db import mongo
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class UserModel:
    """Model class for user-related MongoDB operations."""
    
    COLLECTION = "users"

    @staticmethod
    def create_user(name: str, email: str, password: str, role: str = "USER") -> dict:
        """Create a new user in the MongoDB users collection."""
        hashed_password = generate_password_hash(password)
        user = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": role,
            "created_at": datetime.utcnow()
        }
        result = mongo.db[UserModel.COLLECTION].insert_one(user)
        user["_id"] = str(result.inserted_id)  # Convert ObjectId to string
        del user["password"]  # Exclude password from return
        return user

    @staticmethod
    def find_by_email(email: str) -> dict | None:
        """Find a user by email."""
        user = mongo.db[UserModel.COLLECTION].find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return user

    @staticmethod
    def find_by_id(user_id: str) -> dict | None:
        """Find a user by ID."""
        try:
            user = mongo.db[UserModel.COLLECTION].find_one({"_id": ObjectId(user_id)})
            if user:
                user["_id"] = str(user["_id"])  # Convert ObjectId to string
            return user
        except Exception:
            return None

    @staticmethod
    def verify_password(user: dict, password: str) -> bool:
        """Verify a user's password."""
        return check_password_hash(user["password"], password)

    @staticmethod
    def update_user(user_id: str, update_data: dict) -> bool:
        """Update a user's data."""
        try:
            result = mongo.db[UserModel.COLLECTION].update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception:
            return False

    @staticmethod
    def get_all_users() -> list:
        """Get all users, excluding passwords."""
        users = list(mongo.db[UserModel.COLLECTION].find({}, {"password": 0}))
        for user in users:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return users

    @staticmethod
    def is_admin(user_id: str) -> bool:
        """Check if a user is an admin."""
        user = UserModel.find_by_id(user_id)
        return user and user.get("role") == "ADMIN"