from flask import Blueprint, request, jsonify
from db import db
from models.feedback import (
    create_feedback,
    get_all_feedback,
    update_feedback_status,
    delete_feedback,
    get_feedback_stats
)

feedback_bp = Blueprint("feedback", __name__)


# ➤ Submit feedback
@feedback_bp.route("/submit", methods=["POST"])
def submit_feedback():
    data = request.json

    if not data.get("message") or not data.get("name"):
        return jsonify({"error": "Name and message required"}), 400

    feedback = create_feedback(db, data)
    return jsonify(feedback), 201


# ➤ Get all feedback (admin)
@feedback_bp.route("/all", methods=["GET"])
def fetch_feedback():
    feedbacks = get_all_feedback(db)
    return jsonify(feedbacks), 200


# ➤ Update status (admin)
@feedback_bp.route("/update-status/<id>", methods=["PUT"])
def update_status(id):
    data = request.json
    status = data.get("status")

    if status not in ["new", "reviewed", "resolved"]:
        return jsonify({"error": "Invalid status"}), 400

    updated = update_feedback_status(db, id, status)

    if updated:
        return jsonify({"message": "Status updated"}), 200
    else:
        return jsonify({"error": "Feedback not found"}), 404


# ➤ Delete feedback
@feedback_bp.route("/delete/<id>", methods=["DELETE"])
def remove_feedback(id):
    deleted = delete_feedback(db, id)

    if deleted:
        return jsonify({"message": "Deleted successfully"}), 200
    else:
        return jsonify({"error": "Feedback not found"}), 404


# ➤ Stats (VERY GOOD FOR DASHBOARD)
@feedback_bp.route("/stats", methods=["GET"])
def feedback_stats():
    stats = get_feedback_stats(db)
    return jsonify(stats), 200