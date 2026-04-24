def insert_product(db, data):
    product = {
        "product_id": int(data.get("product_id")),
        "name": data.get("name"),
        "family": data.get("family"),
        "category": data.get("category", "general"),
        "active": True
    }

    result = db.products.insert_one(product)
    product["_id"] = str(result.inserted_id)   # ✅ FIX HERE
    return product


def get_all_products(db):
    products = list(db.products.find())

    for p in products:
        p["_id"] = str(p["_id"])   # ✅ FIX HERE

    return products