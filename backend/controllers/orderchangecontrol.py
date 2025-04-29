from flask import request, jsonify
from models.orderchangemodel import OrderModel
from bson.errors import InvalidId
from functools import wraps
import jwt
from config.config import Config

def token_required(f):
    """Decorator to check JWT token in headers"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
        if not token:
            return jsonify({
                'success': False,
                'message': 'Authentication token is missing',
                'error': 'Unauthorized'
            }), 401
            
        try:
            payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            # Add user info to request
            request.user = {
                'id': payload['id'],
                'email': payload['email'],
                'role': payload.get('role', 'user')
            }
        except jwt.ExpiredSignatureError:
            return jsonify({
                'success': False,
                'message': 'Authentication token has expired',
                'error': 'Unauthorized'
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                'success': False,
                'message': 'Invalid authentication token',
                'error': 'Unauthorized'
            }), 401
            
        return f(*args, **kwargs)
    
    return decorated

class OrderController:
    """Controller for handling order operations"""
    
    @staticmethod
    @token_required
    def create_order():
        """Create a new order"""
        try:
            data = request.json
            required_fields = [
                'customerId', 'customerEmail', 'productId', 
                'productName', 'totalPrice', 'color', 
                'quantity', 'paymentMethod'
            ]
            
            # Check if all required fields are present
            for field in required_fields:
                if field not in data:
                    return jsonify({
                        'success': False,
                        'message': f'Missing required field: {field}',
                        'error': 'Bad Request'
                    }), 400
            
            # Create new order
            order = OrderModel.create_order(data)
            
            return jsonify({
                'success': True,
                'message': 'Order created successfully',
                'data': order
            }), 201
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'error': 'Server Error'
            }), 500
    
    @staticmethod
    @token_required
    def get_customer_orders():
        """Get all orders for the current customer"""
        try:
            # Get customer ID from authenticated user
            customer_id = request.user['id']
            
            orders = OrderModel.get_orders_by_customer(customer_id)
            
            return jsonify({
                'success': True,
                'data': orders,
                'count': len(orders)
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'error': 'Server Error'
            }), 500
    
    @staticmethod
    @token_required
    def get_customer_product_orders(product_id):
        """Get all orders for the current customer and a specific product"""
        try:
            # Get customer ID from authenticated user
            customer_id = request.user['id']
            
            orders = OrderModel.get_customer_product_orders(customer_id, product_id)
            
            return jsonify({
                'success': True,
                'data': orders,
                'count': len(orders)
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'error': 'Server Error'
            }), 500
    
    @staticmethod
    @token_required
    def get_order_details(order_id):
        """Get details of a specific order"""
        try:
            order = OrderModel.get_order_by_id(order_id)
            
            if not order:
                return jsonify({
                    'success': False,
                    'message': 'Order not found',
                    'error': 'Not Found'
                }), 404
            
            # Check if order belongs to current user (unless admin)
            if request.user['role'] != 'admin' and request.user['id'] != order['customerId']:
                return jsonify({
                    'success': False,
                    'message': 'You do not have permission to view this order',
                    'error': 'Forbidden'
                }), 403
            
            return jsonify({
                'success': True,
                'data': order
            }), 200
            
        except InvalidId:
            return jsonify({
                'success': False,
                'message': 'Invalid order ID format',
                'error': 'Bad Request'
            }), 400
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'error': 'Server Error'
            }), 500
    
    @staticmethod
    @token_required
    def update_order_status(order_id):
        """Update the status of an order (admin only)"""
        try:
            # Check if user is admin
            if request.user['role'] != 'admin':
                return jsonify({
                    'success': False,
                    'message': 'You do not have permission to update order status',
                    'error': 'Forbidden'
                }), 403
            
            data = request.json
            if 'status' not in data:
                return jsonify({
                    'success': False,
                    'message': 'Status field is required',
                    'error': 'Bad Request'
                }), 400
            
            # Valid status values
            valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled']
            if data['status'] not in valid_statuses:
                return jsonify({
                    'success': False,
                    'message': f'Invalid status. Must be one of: {", ".join(valid_statuses)}',
                    'error': 'Bad Request'
                }), 400
            
            success = OrderModel.update_order_status(order_id, data['status'])
            
            if not success:
                return jsonify({
                    'success': False,
                    'message': 'Order not found or status not updated',
                    'error': 'Not Found'
                }), 404
            
            return jsonify({
                'success': True,
                'message': 'Order status updated successfully'
            }), 200
            
        except InvalidId:
            return jsonify({
                'success': False,
                'message': 'Invalid order ID format',
                'error': 'Bad Request'
            }), 400
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'error': 'Server Error'
            }), 500
    
    @staticmethod
    @token_required
    def get_all_orders():
        """Get all orders (admin only)"""
        try:
            # Check if user is admin
            if request.user['role'] != 'admin':
                return jsonify({
                    'success': False,
                    'message': 'You do not have permission to view all orders',
                    'error': 'Forbidden'
                }), 403
            
            # Get pagination parameters
            page = int(request.args.get('page', 1))
            limit = int(request.args.get('limit', 20))
            status = request.args.get('status')
            
            # Validate pagination parameters
            if page < 1:
                page = 1
            if limit < 1 or limit > 100:
                limit = 20
            
            orders, total = OrderModel.get_all_orders(page, limit, status)
            
            return jsonify({
                'success': True,
                'data': orders,
                'pagination': {
                    'total': total,
                    'page': page,
                    'limit': limit,
                    'pages': (total + limit - 1) // limit
                }
            }), 200
            
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e),
                'error': 'Server Error'
            }), 500