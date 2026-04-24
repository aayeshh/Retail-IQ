from datetime import datetime
from bson import ObjectId

def create_announcement(db, data):
    announcement = {
        "title": data.get("title"),
        "message": data.get("message"),
        "created_at": datetime.utcnow(),
        "created_by": data.get("created_by", "admin"),
        "is_active": True
    }

    result = db.announcements.insert_one(announcement)
    announcement["_id"] = str(result.inserted_id)
    return announcement


def get_all_announcements(db):
    announcements = list(db.announcements.find().sort("created_at", -1))

    for a in announcements:
        a["_id"] = str(a["_id"])

    return announcements


def delete_announcement(db, announcement_id):
    result = db.announcements.delete_one({"_id": ObjectId(announcement_id)})
    return result.deleted_count