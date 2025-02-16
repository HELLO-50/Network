import os

class Config:
    DB_USER = os.getenv('DB_USER', 'Educationlife')  # Set user
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'Hellothere44')  # Set password securely
    DB_HOST = 'Educationlife.mysql.pythonanywhere-services.com'
    DB_NAME = 'Educationlife$educationlifeDB'  # Database name

    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False