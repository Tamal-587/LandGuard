from flask import Blueprint, jsonify, request
from app.models.models import FraudAlert, db, utcnow

fraud_alerts_bp = Blueprint("fraud_alerts", __name__)

@fraud_alerts_bp.route("", methods=["GET"])
def get_fraud_alerts():
    limit = request.args.get("limit", default=50, type=int)
    offset = request.args.get("offset", default=0, type=int)
    risk_band = request.args.get("risk_band", default=None, type=str)
    alert_type = request.args.get("alert_type", default=None, type=str)
    status = request.args.get("status", default=None, type=str)
    record_id = request.args.get("record_id", default=None, type=str)

    query = FraudAlert.query

    if risk_band:
        query = query.filter_by(risk_band=risk_band.upper())
    if alert_type:
        query = query.filter_by(alert_type=alert_type.upper())
    if status:
        query = query.filter_by(status=status.upper())
    if record_id:
        query = query.filter(FraudAlert.alert_ref.ilike(f"%{record_id}%"))

    total = query.count()
    alerts = (
        query.order_by(FraudAlert.detected_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return jsonify({
        "success": True,
        "total": total,
        "limit": limit,
        "offset": offset,
        "alerts": [a.to_dict() for a in alerts]
    })

@fraud_alerts_bp.route("/<alert_id>", methods=["GET"])
def get_fraud_alert_detail(alert_id):
    alert = None
    if alert_id.isdigit():
        alert = FraudAlert.query.get(int(alert_id))
    if not alert:
        alert = FraudAlert.query.filter_by(alert_ref=alert_id).first()

    if not alert:
        return jsonify({
            "success": False,
            "error": f"Fraud alert '{alert_id}' not found."
        }), 404

    return jsonify({
        "success": True,
        "alert": alert.to_dict()
    })

@fraud_alerts_bp.route("/<alert_id>", methods=["PATCH"])
def update_fraud_alert(alert_id):
    alert = None
    if alert_id.isdigit():
        alert = FraudAlert.query.get(int(alert_id))
    if not alert:
        alert = FraudAlert.query.filter_by(alert_ref=alert_id).first()

    if not alert:
        return jsonify({
            "success": False,
            "error": f"Fraud alert '{alert_id}' not found."
        }), 404

    data = request.get_json(silent=True) or {}
    new_status = data.get("status")
    reviewer_notes = data.get("reviewer_notes")

    if new_status:
        valid_statuses = ["OPEN", "REVIEWED", "UNRESOLVED"]
        if new_status.upper() not in valid_statuses:
            return jsonify({
                "success": False,
                "error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            }), 400
        alert.status = new_status.upper()
        alert.reviewed_at = utcnow()

    if reviewer_notes is not None:
        alert.reviewer_notes = reviewer_notes

    db.session.commit()

    return jsonify({
        "success": True,
        "message": f"Alert {alert.alert_ref} status updated to {alert.status}",
        "alert": alert.to_dict()
    })
