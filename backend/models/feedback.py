from datetime import datetime
from bson import ObjectId


def create_feedback(db, data):
    feedback = {
        "user_id": data.get("user_id"),
        "name": data.get("name"),
        "email": data.get("email"),
        "message": data.get("message"),
        "rating": int(data.get("rating", 0)),
        "category": data.get("category", "other"),
        "created_at": datetime.utcnow(),
        "status": "new"
    }

    result = db.feedback.insert_one(feedback)
    feedback["_id"] = str(result.inserted_id)
    return feedback


def get_all_feedback(db):
    feedbacks = list(db.feedback.find().sort("created_at", -1))

    for f in feedbacks:
        f["_id"] = str(f["_id"])

    return feedbacks


def update_feedback_status(db, feedback_id, status):
    result = db.feedback.update_one(
        {"_id": ObjectId(feedback_id)},
        {"$set": {"status": status}}
    )
    return result.modified_count


def delete_feedback(db, feedback_id):
    result = db.feedback.delete_one({"_id": ObjectId(feedback_id)})
    return result.deleted_count


def get_feedback_stats(db):
    total = db.feedback.count_documents({})
    avg_rating = list(db.feedback.aggregate([
        {"$group": {"_id": None, "avg": {"$avg": "$rating"}}}
    ]))

    return {
        "total_feedback": total,
        "average_rating": avg_rating[0]["avg"] if avg_rating else 0
    }