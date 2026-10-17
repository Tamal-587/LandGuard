from flask import Blueprint, jsonify
from app.models.models import (
    LandRecord, FraudAlert, VerificationReport, OwnershipTransaction, MutationHistory, DocumentReference
)

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/stats", methods=["GET"])
def get_dashboard_stats():
    total_records = LandRecord.query.count()
    screened_records = LandRecord.query.filter(LandRecord.last_verified_at.isnot(None)).count()
    
    # Reports count by risk band
    high_risk_count = VerificationReport.query.filter_by(risk_band="HIGH").count()
    medium_risk_count = VerificationReport.query.filter_by(risk_band="MEDIUM").count()
    low_risk_count = VerificationReport.query.filter_by(risk_band="LOW").count()

    # Documents and mismatches counts
    documents_verified_count = DocumentReference.query.filter_by(verified_hash=True).count()
    record_mismatches_count = FraudAlert.query.filter(
        FraudAlert.alert_type.in_(["MUTATION_MISMATCH", "OWNERSHIP_CHAIN_INCONSISTENCY"])
    ).count()

    # Active alerts count
    open_alerts_count = FraudAlert.query.filter_by(status="OPEN").count()
    total_alerts_count = FraudAlert.query.count()

    # Calculate clean / no risk records
    flagged_records_count = LandRecord.query.filter(LandRecord.record_status != "Active / Consistent").count()
    clean_records_count = max(0, total_records - flagged_records_count)

    # 4-tier Risk distribution chart data matching reference UI
    risk_distribution = [
        {"name": "High Risk", "value": high_risk_count, "color": "#EF4444"},
        {"name": "Medium Risk", "value": medium_risk_count, "color": "#F59E0B"},
        {"name": "Low Risk", "value": low_risk_count, "color": "#10B981"},
        {"name": "No Risk", "value": clean_records_count, "color": "#059669"},
    ]

    # Monthly screening activity (prototype breakdown)
    monthly_activity = [
        {"month": "May 2024", "screened": 12, "highRisk": 1, "mediumRisk": 2},
        {"month": "Jun 2024", "screened": 18, "highRisk": 2, "mediumRisk": 4},
        {"month": "Jul 2024", "screened": 25, "highRisk": 3, "mediumRisk": 5},
        {"month": "Aug 2024", "screened": 30, "highRisk": 4, "mediumRisk": 6},
        {"month": "Sep 2024", "screened": 22, "highRisk": 2, "mediumRisk": 3},
        {"month": "Oct 2024", "screened": screened_records, "highRisk": high_risk_count, "mediumRisk": medium_risk_count},
    ]

    # Recent verification activity (latest 5 reports)
    recent_reports = (
        VerificationReport.query.order_by(VerificationReport.created_at.desc())
        .limit(5)
        .all()
    )

    # Recent fraud alerts (latest 5 alerts)
    recent_alerts = (
        FraudAlert.query.order_by(FraudAlert.detected_at.desc())
        .limit(5)
        .all()
    )

    # Recently screened land records (latest 6)
    recent_screened_records = (
        LandRecord.query.filter(LandRecord.last_verified_at.isnot(None))
        .order_by(LandRecord.last_verified_at.desc())
        .limit(6)
        .all()
    )

    return jsonify({
        "success": True,
        "is_synthetic_demo": True,
        "summary": {
            "total_records": total_records,
            "records_screened": screened_records,
            "documents_verified": documents_verified_count,
            "high_risk_cases": high_risk_count,
            "medium_risk_cases": medium_risk_count,
            "no_conflict_cases": low_risk_count,
            "record_mismatches": record_mismatches_count,
            "open_alerts": open_alerts_count,
            "total_alerts": total_alerts_count
        },
        "risk_distribution": risk_distribution,
        "monthly_activity": monthly_activity,
        "recent_reports": [r.to_dict() for r in recent_reports],
        "recent_alerts": [a.to_dict() for a in recent_alerts],
        "recently_screened_records": [r.to_dict() for r in recent_screened_records]
    })
