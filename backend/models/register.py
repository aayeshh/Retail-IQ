from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


def create_user(db, full_name, phone, email, password, account_type="individual"):
    existing = db.users.find_one({"email": email.lower().strip()})
    if existing:
        return None, "Email already exists."

    user = {
        "account_type": account_type,
        "full_name": full_name.strip(),
        "phone": phone.strip(),
        "email": email.lower().strip(),
        "password_hash": generate_password_hash(password),
        "created_at": datetime.utcnow(),
    }

    result = db.users.insert_one(user)
    user["_id"] = str(result.inserted_id)
    user.pop("password_hash", None)
    return user, None


def login_user(db, email, password):
    user = db.users.find_one({"email": email.lower().strip()})
    if not user:
        return None

    if not check_password_hash(user.get("password_hash", ""), password):
        return None

    return {
        "_id": str(user["_id"]),
        "account_type": user.get("account_type", "individual"),
        "full_name": user.get("full_name", ""),
        "phone": user.get("phone", ""),
        "email": user.get("email", ""),
    }
