from flask import Blueprint, jsonify, request
from app.models.models import VerificationReport, LandRecord
from app.services.verification_service import run_land_record_verification

verification_bp = Blueprint("verification", __name__)

@verification_bp.route("/verify/<record_id>", methods=["POST"])
def verify_record(record_id):
    # Check if record exists
    data = request.get_json(silent=True) or {}
    notes = data.get("notes")

    res = run_land_record_verification(record_id, custom_notes=notes)
    if not res.get("success"):
        return jsonify(res), 404

    return jsonify(res), 200

@verification_bp.route("/verification-reports", methods=["GET"])
def get_verification_reports():
    limit = request.args.get("limit", default=50, type=int)
    offset = request.args.get("offset", default=0, type=int)
    risk_filter = request.args.get("risk_band", default=None, type=str)

    query = VerificationReport.query
    if risk_filter:
        query = query.filter_by(risk_band=risk_filter.upper())

    total = query.count()
    reports = (
        query.order_by(VerificationReport.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return jsonify({
        "success": True,
        "total": total,
        "limit": limit,
        "offset": offset,
        "reports": [r.to_dict() for r in reports]
    })

@verification_bp.route("/verification-reports/<report_id>", methods=["GET"])
def get_verification_report_detail(report_id):
    report = None
    if report_id.isdigit():
        report = VerificationReport.query.get(int(report_id))
    if not report:
        report = VerificationReport.query.filter_by(report_ref=report_id).first()

    if not report:
        return jsonify({
            "success": False,
            "error": f"Verification report '{report_id}' not found."
        }), 404

    return jsonify({
        "success": True,
        "report": report.to_dict()
    })
