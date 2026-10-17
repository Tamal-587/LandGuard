import json
from datetime import datetime, timezone
from typing import Optional, Dict, Any

from app.models.models import (
    db, LandRecord, FraudAlert, VerificationReport, utcnow
)
from app.services.rules_engine import FraudDetectionEngine, ScreeningResult

def run_land_record_verification(record_id: str, custom_notes: Optional[str] = None) -> Dict[str, Any]:
    """
    Executes screening rules against a synthetic land record and records findings/alerts.
    """
    land_record = LandRecord.query.filter_by(record_id=record_id).first()
    if not land_record:
        return {"success": False, "error": f"Land record '{record_id}' not found"}

    engine = FraudDetectionEngine()
    result: ScreeningResult = engine.evaluate(land_record)

    # Persist or update alerts for each finding
    for finding in result.findings:
        # Alert ref format: ALT-<record_id>-<rule_code>
        alert_ref = f"ALT-{land_record.record_id}-{finding.rule_code}"
        existing_alert = FraudAlert.query.filter_by(alert_ref=alert_ref).first()
        
        evidence_str = json.dumps(finding.evidence, default=str)
        if not existing_alert:
            new_alert = FraudAlert(
                alert_ref=alert_ref,
                land_record_id=land_record.id,
                alert_type=finding.rule_code,
                risk_band=finding.severity,
                risk_score=finding.points,
                title=finding.title,
                description=finding.explanation,
                evidence_json=evidence_str,
                status="OPEN",
                detected_at=utcnow()
            )
            db.session.add(new_alert)
        else:
            # Refresh details if reopened
            existing_alert.risk_score = finding.points
            existing_alert.risk_band = finding.severity
            existing_alert.description = finding.explanation
            existing_alert.evidence_json = evidence_str

    # Create verification report
    report_count = VerificationReport.query.count()
    report_ref = f"REP-2024-{(report_count + 1):04d}"
    
    report = VerificationReport(
        report_ref=report_ref,
        land_record_id=land_record.id,
        screening_status=result.screening_status,
        risk_score=result.risk_score,
        risk_band=result.risk_band,
        checks_performed_json=json.dumps(result.checks_performed),
        findings_json=json.dumps([
            {
                "rule_code": f.rule_code,
                "rule_name": f.rule_name,
                "points": f.points,
                "severity": f.severity,
                "title": f.title,
                "explanation": f.explanation,
                "evidence": f.evidence,
                "suggested_action": f.suggested_action
            }
            for f in result.findings
        ]),
        triggered_rules_json=json.dumps(result.triggered_rules),
        recommended_next_steps=result.recommended_next_steps,
        disclaimer=result.disclaimer,
        created_at=utcnow()
    )
    db.session.add(report)

    # Update record status & last_verified_at
    land_record.last_verified_at = utcnow()
    if result.risk_band == "HIGH":
        land_record.record_status = "Disputed / High Risk"
    elif result.risk_band == "MEDIUM":
        land_record.record_status = "Under Review"
    else:
        land_record.record_status = "Active / Consistent"

    db.session.commit()

    return {
        "success": True,
        "report_id": report.id,
        "report_ref": report.report_ref,
        "screening_result": result.to_dict(),
        "report": report.to_dict()
    }
