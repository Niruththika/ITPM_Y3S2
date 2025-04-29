from datetime import datetime
from bson import ObjectId
from config.db import mongo

class OrderModel:
    """Model for handling order operations with MongoDB"""
    
    @staticmethod
    def create_order(order_data):
        """
        Create a new order in the database
        
        Args:
            order_data (dict): Order details including customer and product info
            
        Returns:
            dict: Newly created order
        """
        # Add created timestamp and initial status
        order_data['createdAt'] = datetime.utcnow()
        order_data['updatedAt'] = datetime.utcnow()
        order_data['status'] = 'pending'  # Default status for new orders
        
        # Insert the order into MongoDB
        result = mongo.db.orderadding.insert_one(order_data)
        
        # Get the new order with _id
        created_order = mongo.db.orderadding.find_one({'_id': result.inserted_id})
        
        # Convert ObjectId to string for JSON serialization
        created_order['_id'] = str(created_order['_id'])
        
        return created_order
    
    @staticmethod
    def get_orders_by_customer(customer_id):
        """
        Get all orders for a specific customer
        
        Args:
            customer_id (str): Customer ID
            
        Returns:
            list: List of customer's orders
        """
        orders = list(mongo.db.orderadding.find({'customerId': customer_id}).sort('createdAt', -1))
        
        # Convert ObjectId to string for JSON serialization
        for order in orders:
            order['_id'] = str(order['_id'])
        
        return orders
    
    @staticmethod
    def get_customer_product_orders(customer_id, product_id):
        """
        Get all orders for a specific customer and product
        
        Args:
            customer_id (str): Customer ID
            product_id (str): Product ID
            
        Returns:
            list: List of customer's orders for the specified product
        """
        orders = list(mongo.db.orderadding.find({
            'customerId': customer_id,
            'productId': product_id
        }).sort('createdAt', -1))
        
        # Convert ObjectId to string for JSON serialization
        for order in orders:
            order['_id'] = str(order['_id'])
        
        return orders
    
    @staticmethod
    def get_order_by_id(order_id):
        """
        Get a specific order by ID
        
        Args:
            order_id (str): Order ID
            
        Returns:
            dict: Order details
        """
        try:
            order = mongo.db.orderadding.find_one({'_id': ObjectId(order_id)})
            if order:
                order['_id'] = str(order['_id'])
            return order
        except Exception as e:
            print(f"Error fetching order: {e}")
            return None
    
    @staticmethod
    def update_order_status(order_id, status):
        """
        Update the status of an order
        
        Args:
            order_id (str): Order ID
            status (str): New status for the order
            
        Returns:
            bool: Success status of update operation
        """
        try:
            result = mongo.db.orderadding.update_one(
                {'_id': ObjectId(order_id)},
                {
                    '$set': {
                        'status': status,
                        'updatedAt': datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating order: {e}")
            return False
    
    @staticmethod
    def get_all_orders(page=1, limit=20, status=None):
        """
        Get all orders with pagination and optional status filter
        
        Args:
            page (int): Page number (1-indexed)
            limit (int): Number of items per page
            status (str, optional): Filter by order status
            
        Returns:
            tuple: (list of orders, total count)
        """
        skip = (page - 1) * limit
        
        # Build query filter
        query = {}
        if status:
            query['status'] = status
        
        # Get total count
        total = mongo.db.orderadding.count_documents(query)
        
        # Get orders with pagination
        cursor = mongo.db.orderadding.find(query).sort('createdAt', -1).skip(skip).limit(limit)
        orders = list(cursor)
        
        # Convert ObjectId to string for JSON serialization
        for order in orders:
            order['_id'] = str(order['_id'])
        
        return orders, total