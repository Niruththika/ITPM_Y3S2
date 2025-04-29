from flask import Blueprint, request, jsonify
from controllers.feedbackcontrol import FeedbackController
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Define the blueprint once
feedback_routes = Blueprint('feedback_routes', __name__)

# Sentiment model setup
model_name = "tabularisai/multilingual-sentiment-analysis"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

sentiment_map = {
    0: "Very Negative",
    1: "Negative",
    2: "Neutral",
    3: "Positive",
    4: "Very Positive"
}

# ===== CRUD Routes =====

@feedback_routes.route('/feedback', methods=['POST'])
def add_feedback():
    data = request.json
    FeedbackController.create_feedback(data)
    return jsonify({"success": True, "message": "Feedback added successfully"}), 201

@feedback_routes.route('/feedback', methods=['GET'])
def fetch_feedback():
    feedbacks = FeedbackController.get_all_feedback()
    return jsonify(feedbacks), 201

@feedback_routes.route('/feedback/<feedback_id>', methods=['PUT'])
def edit_feedback(feedback_id):
    data = request.json
    FeedbackController.update_feedback(feedback_id, data)
    return jsonify({"success": True, "message": "Feedback updated successfully"}), 201

@feedback_routes.route('/feedback/<feedback_id>', methods=['DELETE'])
def remove_feedback(feedback_id):
    FeedbackController.delete_feedback(feedback_id)
    return jsonify({"success": True, "message": "Feedback deleted successfully"}), 201

# ===== Sentiment Analysis Route =====

@feedback_routes.route('/feedback/review-sentiments', methods=['GET'])
def review_sentiments():
    from config.db import mongo
    reviews = list(mongo.db.feedback.find({}, {"review": 1}))

    sentiment_counts = {
        "Very Negative": 0,
        "Negative": 0,
        "Neutral": 0,
        "Positive": 0,
        "Very Positive": 0
    }

    texts = [review.get('review', '') for review in reviews if review.get('review')]

    if not texts:
        return jsonify(sentiment_counts), 200

    inputs = tokenizer(texts, return_tensors="pt", truncation=True, padding=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)

    sentiments = torch.argmax(outputs.logits, dim=-1).tolist()

    for sentiment in sentiments:
        sentiment_label = sentiment_map[sentiment]
        sentiment_counts[sentiment_label] += 1

    return jsonify(sentiment_counts), 200
