import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///todo.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Yandex Cloud S3 configuration
    YC_S3_ENDPOINT = os.environ.get('YC_S3_ENDPOINT')
    YC_S3_ACCESS_KEY = os.environ.get('YC_S3_ACCESS_KEY')
    YC_S3_SECRET_KEY = os.environ.get('YC_S3_SECRET_KEY')
    YC_S3_BUCKET = os.environ.get('YC_S3_BUCKET')
    YC_S3_REGION = os.environ.get('YC_S3_REGION', 'ru-central1')
    
    # File upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}