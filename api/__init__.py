from flask import Flask, request
from flask_restful import Api
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
import mongoengine as db

app = Flask(__name__)
api = Api(app)

# Load environment variables from .env file
load_dotenv()

# Configure app
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

# For CORS
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

import routes