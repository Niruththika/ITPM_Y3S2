from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, ExpiredSignatureError, InvalidTokenError

def jwt_required_middleware(fn):
    """Custom decorator for JWT authentication middleware."""
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return fn(*args, **kwargs)
        except ExpiredSignatureError:
            return jsonify({"message": "Token has expired", "success": False}), 401
        except InvalidTokenError:
            return jsonify({"message": "Invalid token", "success": False}), 401
        except Exception:
            return jsonify({"message": "Unauthorized", "success": False}), 401
    return wrapper