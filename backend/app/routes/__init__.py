from .dashboard import dashboard_bp
from .land_records import land_records_bp
from .verification import verification_bp
from .fraud_alerts import fraud_alerts_bp
from .documents import documents_bp

__all__ = [
    "dashboard_bp",
    "land_records_bp",
    "verification_bp",
    "fraud_alerts_bp",
    "documents_bp"
]
