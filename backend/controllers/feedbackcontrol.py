from config.db import mongo
from bson import ObjectId

class FeedbackController:

    @staticmethod
    def create_feedback(data):
        mongo.db.feedback.insert_one(data)

    @staticmethod
    def get_all_feedback():
        feedbacks = mongo.db.feedback.find()
        return [{**f, "_id": str(f["_id"])} for f in feedbacks]

    @staticmethod
    def update_feedback(feedback_id, data):
            # Prevent updating '_id'
            if "_id" in data:
                data.pop("_id")

            mongo.db.feedback.update_one(
                {"_id": ObjectId(feedback_id)},
                {"$set": data}
            )

    @staticmethod
    def delete_feedback(feedback_id):
        mongo.db.feedback.delete_one({"_id": ObjectId(feedback_id)})
