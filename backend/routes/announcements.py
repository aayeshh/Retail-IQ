from flask import Blueprint, request, jsonify
# from config import db
from db import db
from models.announcement import (
    create_announcement,
    get_all_announcements,
    delete_announcement
)

announcements_bp = Blueprint("announcements", __name__)


# ➤ Create announcement
@announcements_bp.route("/create", methods=["POST"])
def add_announcement():
    data = request.json

    if not data.get("title") or not data.get("message"):
        return jsonify({"error": "Title and message required"}), 400

    announcement = create_announcement(db, data)
    return jsonify(announcement), 201


# ➤ Get all announcements
@announcements_bp.route("/all", methods=["GET"])
def fetch_announcements():
    announcements = get_all_announcements(db)
    return jsonify(announcements), 200


# ➤ Delete announcement
@announcements_bp.route("/delete/<id>", methods=["DELETE"])
def remove_announcement(id):
    deleted = delete_announcement(db, id)

    if deleted:
        return jsonify({"message": "Deleted successfully"}), 200
    else:
        return jsonify({"error": "Announcement not found"}), 404