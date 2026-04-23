from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import config
from routes.forecast import forecast_bp

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(config.MONGO_URI)
db = client.get_database()

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

if __name__ == '__main__':
    app.run(debug=True)