from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import config
from routes.forecast import forecast_bp
from routes.announcements import announcements_bp
from routes.feedback import feedback_bp
from routes.sales import sales_bp
from routes.products import products_bp
from routes.analytics import analytics_bp
from routes.dashboard import dashboard_bp
from db import db

app = Flask(__name__)
CORS(app)

# # MongoDB connection
# client = MongoClient(config.MONGO_URI)
# db = client.get_database()

@app.route('/')
def home():
    return {"message": "RetailIQ backend running"}

@app.route('/test-db') #just checking connection
def test_db():
    collections = db.list_collection_names()
    return {"collections": collections}

@app.route('/create-test') #just for checking if retialiq comes in db
def create_test():
    db.test.insert_one({"name": "RetailIQ Test"})
    return {"message": "Inserted"}

app.register_blueprint(forecast_bp, url_prefix='/api/forecast')
app.register_blueprint(announcements_bp, url_prefix="/api/announcements")
app.register_blueprint(feedback_bp, url_prefix="/api/feedback") 

app.register_blueprint(sales_bp, url_prefix="/api/sales")
app.register_blueprint(products_bp, url_prefix="/api/products")
app.register_blueprint(analytics_bp, url_prefix="/api/analytics")

app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

if __name__ == '__main__':
    app.run(debug=True)