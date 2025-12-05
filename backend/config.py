import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    YC_S3_ENDPOINT = os.environ.get('YC_S3_ENDPOINT')
    YC_S3_ACCESS_KEY = os.environ.get('YC_S3_ACCESS_KEY')
    YC_S3_SECRET_KEY = os.environ.get('YC_S3_SECRET_KEY')
    YC_S3_BUCKET = os.environ.get('YC_S3_BUCKET')
    
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}