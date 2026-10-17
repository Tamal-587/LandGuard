from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def utcnow():
    return datetime.now(timezone.utc)

class SyntheticOwner(db.Model):
    __tablename__ = "synthetic_owners"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    full_name = db.Column(db.String(120), nullable=False, index=True)
    nid_hash = db.Column(db.String(64), nullable=False)
    synthetic_id_label = db.Column(db.String(100), nullable=False)
    phone_masked = db.Column(db.String(30), nullable=False)
    address = db.Column(db.String(250), nullable=False)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "full_name": self.full_name,
            "nid_hash": self.nid_hash,
            "synthetic_id_label": self.synthetic_id_label,
            "phone_masked": self.phone_masked,
            "address": self.address,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class LandRecord(db.Model):
    __tablename__ = "land_records"

    id = db.Column(db.Integer, primary_key=True)
    record_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    khatian_no = db.Column(db.String(50), nullable=False, index=True)
    plot_no = db.Column(db.String(50), nullable=False, index=True)
    mouza = db.Column(db.String(100), nullable=False, index=True)
    district = db.Column(db.String(50), nullable=False, index=True)
    division = db.Column(db.String(50), nullable=False)
    land_type = db.Column(db.String(50), nullable=False)
    area_acres = db.Column(db.Float, nullable=False)
    recorded_owner_id = db.Column(db.Integer, db.ForeignKey("synthetic_owners.id"), nullable=True)
    record_status = db.Column(db.String(30), nullable=False, default="Active")
    last_verified_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    recorded_owner = db.relationship("SyntheticOwner", backref="land_records", lazy="joined")
    transactions = db.relationship("OwnershipTransaction", backref="land_record", lazy="select", cascade="all, delete-orphan", order_by="OwnershipTransaction.deed_date.desc()")
    mutations = db.relationship("MutationHistory", backref="land_record", lazy="select", cascade="all, delete-orphan", order_by="MutationHistory.application_date.desc()")
    documents = db.relationship("DocumentReference", backref="land_record", lazy="select", cascade="all, delete-orphan")
    alerts = db.relationship("FraudAlert", backref="land_record", lazy="select", cascade="all, delete-orphan", order_by="FraudAlert.detected_at.desc()")
    verification_reports = db.relationship("VerificationReport", backref="land_record", lazy="select", cascade="all, delete-orphan", order_by="VerificationReport.created_at.desc()")

    def to_dict(self, include_nested=False):
        data = {
            "id": self.id,
            "record_id": self.record_id,
            "khatian_no": self.khatian_no,
            "plot_no": self.plot_no,
            "mouza": self.mouza,
            "district": self.district,
            "division": self.division,
            "land_type": self.land_type,
            "area_acres": self.area_acres,
            "recorded_owner_id": self.recorded_owner_id,
            "recorded_owner": self.recorded_owner.to_dict() if self.recorded_owner else None,
            "record_status": self.record_status,
            "last_verified_at": self.last_verified_at.isoformat() if self.last_verified_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_nested:
            data["transactions"] = [t.to_dict() for t in self.transactions]
            data["mutations"] = [m.to_dict() for m in self.mutations]
            data["documents"] = [d.to_dict() for d in self.documents]
            data["alerts"] = [a.to_dict() for a in self.alerts]
            data["verification_reports"] = [r.to_dict() for r in self.verification_reports]
        return data

class OwnershipTransaction(db.Model):
    __tablename__ = "ownership_transactions"

    id = db.Column(db.Integer, primary_key=True)
    transaction_ref = db.Column(db.String(50), nullable=False, index=True)
    land_record_id = db.Column(db.Integer, db.ForeignKey("land_records.id"), nullable=False, index=True)
    seller_id = db.Column(db.Integer, db.ForeignKey("synthetic_owners.id"), nullable=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey("synthetic_owners.id"), nullable=False)
    deed_number = db.Column(db.String(50), nullable=False, index=True)
    deed_date = db.Column(db.Date, nullable=False)
    transaction_value_bdt = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), nullable=False, default="COMPLETED")  # COMPLETED, PENDING_REGISTRATION, CANCELLED, UNDER_REVIEW
    registration_office = db.Column(db.String(100), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow, nullable=False)

    seller = db.relationship("SyntheticOwner", foreign_keys=[seller_id], lazy="joined")
    buyer = db.relationship("SyntheticOwner", foreign_keys=[buyer_id], lazy="joined")

    def to_dict(self):
        return {
            "id": self.id,
            "transaction_ref": self.transaction_ref,
            "land_record_id": self.land_record_id,
            "seller_id": self.seller_id,
            "seller": self.seller.to_dict() if self.seller else None,
            "buyer_id": self.buyer_id,
            "buyer": self.buyer.to_dict() if self.buyer else None,
            "deed_number": self.deed_number,
            "deed_date": self.deed_date.isoformat() if self.deed_date else None,
            "transaction_value_bdt": self.transaction_value_bdt,
            "status": self.status,
            "registration_office": self.registration_office,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class MutationHistory(db.Model):
    __tablename__ = "mutation_histories"

    id = db.Column(db.Integer, primary_key=True)
    mutation_case_no = db.Column(db.String(50), unique=True, nullable=False, index=True)
    land_record_id = db.Column(db.Integer, db.ForeignKey("land_records.id"), nullable=False, index=True)
    transaction_id = db.Column(db.Integer, db.ForeignKey("ownership_transactions.id"), nullable=True)
    applicant_name = db.Column(db.String(120), nullable=False)
    previous_owner_name = db.Column(db.String(120), nullable=False)
    new_khatian_no = db.Column(db.String(50), nullable=True)
    application_date = db.Column(db.Date, nullable=False)
    approval_date = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(30), nullable=False, default="APPROVED")  # APPROVED, PENDING, REJECTED, IRREGULAR
    ac_land_office = db.Column(db.String(100), nullable=False)
    remarks = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)

    transaction = db.relationship("OwnershipTransaction", lazy="joined")

    def to_dict(self):
        return {
            "id": self.id,
            "mutation_case_no": self.mutation_case_no,
            "land_record_id": self.land_record_id,
            "transaction_id": self.transaction_id,
            "applicant_name": self.applicant_name,
            "previous_owner_name": self.previous_owner_name,
            "new_khatian_no": self.new_khatian_no,
            "application_date": self.application_date.isoformat() if self.application_date else None,
            "approval_date": self.approval_date.isoformat() if self.approval_date else None,
            "status": self.status,
            "ac_land_office": self.ac_land_office,
            "remarks": self.remarks,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class DocumentReference(db.Model):
    __tablename__ = "document_references"

    id = db.Column(db.Integer, primary_key=True)
    land_record_id = db.Column(db.Integer, db.ForeignKey("land_records.id"), nullable=False, index=True)
    doc_type = db.Column(db.String(50), nullable=False)  # DEED, KHATIAN_PORCHA, MUTATION_ORDER, TAX_RECEIPT
    doc_title = db.Column(db.String(150), nullable=False)
    reference_hash = db.Column(db.String(64), nullable=False)  # SHA-256
    file_name = db.Column(db.String(100), nullable=False)
    file_size_bytes = db.Column(db.Integer, nullable=False, default=102400)
    upload_date = db.Column(db.DateTime, default=utcnow, nullable=False)
    verified_hash = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "land_record_id": self.land_record_id,
            "doc_type": self.doc_type,
            "doc_title": self.doc_title,
            "reference_hash": self.reference_hash,
            "file_name": self.file_name,
            "file_size_bytes": self.file_size_bytes,
            "upload_date": self.upload_date.isoformat() if self.upload_date else None,
            "verified_hash": self.verified_hash,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class FraudAlert(db.Model):
    __tablename__ = "fraud_alerts"

    id = db.Column(db.Integer, primary_key=True)
    alert_ref = db.Column(db.String(50), unique=True, nullable=False, index=True)
    land_record_id = db.Column(db.Integer, db.ForeignKey("land_records.id"), nullable=False, index=True)
    alert_type = db.Column(db.String(50), nullable=False, index=True)
    risk_band = db.Column(db.String(20), nullable=False, index=True)  # LOW, MEDIUM, HIGH
    risk_score = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    evidence_json = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), nullable=False, default="OPEN", index=True)  # OPEN, REVIEWED, UNRESOLVED
    detected_at = db.Column(db.DateTime, default=utcnow, nullable=False)
    reviewed_at = db.Column(db.DateTime, nullable=True)
    reviewer_notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "alert_ref": self.alert_ref,
            "land_record_id": self.land_record_id,
            "land_record_identifier": self.land_record.record_id if self.land_record else None,
            "plot_no": self.land_record.plot_no if self.land_record else None,
            "mouza": self.land_record.mouza if self.land_record else None,
            "alert_type": self.alert_type,
            "risk_band": self.risk_band,
            "risk_score": self.risk_score,
            "title": self.title,
            "description": self.description,
            "evidence_json": self.evidence_json,
            "status": self.status,
            "detected_at": self.detected_at.isoformat() if self.detected_at else None,
            "reviewed_at": self.reviewed_at.isoformat() if self.reviewed_at else None,
            "reviewer_notes": self.reviewer_notes,
        }

class VerificationReport(db.Model):
    __tablename__ = "verification_reports"

    id = db.Column(db.Integer, primary_key=True)
    report_ref = db.Column(db.String(50), unique=True, nullable=False, index=True)
    land_record_id = db.Column(db.Integer, db.ForeignKey("land_records.id"), nullable=False, index=True)
    screening_status = db.Column(db.String(50), nullable=False)
    risk_score = db.Column(db.Integer, nullable=False)
    risk_band = db.Column(db.String(20), nullable=False)
    checks_performed_json = db.Column(db.Text, nullable=False)
    findings_json = db.Column(db.Text, nullable=False)
    triggered_rules_json = db.Column(db.Text, nullable=False)
    recommended_next_steps = db.Column(db.Text, nullable=False)
    disclaimer = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "report_ref": self.report_ref,
            "land_record_id": self.land_record_id,
            "land_record_identifier": self.land_record.record_id if self.land_record else None,
            "khatian_no": self.land_record.khatian_no if self.land_record else None,
            "plot_no": self.land_record.plot_no if self.land_record else None,
            "mouza": self.land_record.mouza if self.land_record else None,
            "screening_status": self.screening_status,
            "risk_score": self.risk_score,
            "risk_band": self.risk_band,
            "checks_performed_json": self.checks_performed_json,
            "findings_json": self.findings_json,
            "triggered_rules_json": self.triggered_rules_json,
            "recommended_next_steps": self.recommended_next_steps,
            "disclaimer": self.disclaimer,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
