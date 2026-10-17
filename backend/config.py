import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "landguard-dev-insecure-secret-key-2024")
    # SQLite default, easily swapped with MySQL: mysql+pymysql://user:pass@host/dbname
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{BASE_DIR / 'landguard.db'}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max file upload
    UPLOAD_FOLDER = BASE_DIR / "uploads"
    DEMO_MODE = True
