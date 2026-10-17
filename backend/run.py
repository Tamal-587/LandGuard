import os
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app import create_app

from app.models.models import db, LandRecord
from app.seed_data import seed_database

app = create_app()

with app.app_context():
    # If database has no land records, seed with demo data
    try:
        db.create_all()
        if LandRecord.query.count() == 0:
            print("No records found. Seeding synthetic demonstration dataset...")
            seed_database()
            print("Database initialized and seeded successfully.")
    except Exception as e:
        print(f"Database initialization error: {e}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV") == "development"
    print(f"Starting LandGuard Backend API on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=debug)
