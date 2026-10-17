import copy
from flask import Blueprint, jsonify, request
from app.models.models import LandRecord, OwnershipTransaction, MutationHistory
from app.services.rules_engine import FraudDetectionEngine

simulation_bp = Blueprint("simulation", __name__)

# Lightweight mock classes for in-memory simulation without modifying SQLAlchemy session
class SimulatedRecord:
    def __init__(self, record):
        self.id = record.id
        self.record_id = record.record_id
        self.khatian_no = record.khatian_no
        self.plot_no = record.plot_no
        self.mouza = record.mouza
        self.district = record.district
        self.recorded_owner_id = record.recorded_owner_id
        self.recorded_owner = record.recorded_owner
        self.record_status = record.record_status
        self.transactions = []
        for t in record.transactions or []:
            self.transactions.append(SimulatedTransaction(t))
        self.mutations = []
        for m in record.mutations or []:
            self.mutations.append(SimulatedMutation(m))
        self.documents = list(record.documents or [])

class SimulatedTransaction:
    def __init__(self, t):
        self.id = t.id
        self.transaction_ref = t.transaction_ref
        self.seller_id = t.seller_id
        self.seller = t.seller
        self.buyer_id = t.buyer_id
        self.buyer = t.buyer
        self.deed_number = t.deed_number
        self.deed_date = t.deed_date
        self.transaction_value_bdt = t.transaction_value_bdt
        self.status = t.status
        self.registration_office = t.registration_office

class SimulatedMutation:
    def __init__(self, m):
        self.id = m.id
        self.mutation_case_no = m.mutation_case_no
        self.transaction_id = m.transaction_id
        self.applicant_name = m.applicant_name
        self.previous_owner_name = m.previous_owner_name
        self.status = m.status
        self.remarks = m.remarks
        self.application_date = m.application_date
        self.approval_date = m.approval_date

@simulation_bp.route("/evaluate", methods=["POST"])
def evaluate_what_if():
    data = request.get_json(silent=True) or {}
    record_id = data.get("record_id", "").strip()
    target_deed = data.get("target_deed", "").strip()
    scenario = data.get("scenario", "CANCEL_DEED")

    record = None
    if record_id.isdigit():
        record = LandRecord.query.get(int(record_id))
    if not record:
        record = LandRecord.query.filter_by(record_id=record_id).first()
    if not record:
        record = LandRecord.query.filter(LandRecord.record_status.ilike("%Disputed%")).first() or LandRecord.query.first()

    if not record:
        return jsonify({"success": False, "error": "Land record not found"}), 404

    engine = FraudDetectionEngine()

    # 1. Evaluate baseline (original state)
    baseline_result = engine.evaluate(record)

    # 2. Build isolated in-memory copy
    simulated_record = SimulatedRecord(record)

    scenario_explanation = ""

    # 3. Apply hypothetical modifications strictly to simulated_record
    if scenario == "CANCEL_DEED":
        # Mark conflicting/pending deed as CANCELLED
        modified_count = 0
        for txn in simulated_record.transactions:
            if (target_deed and (target_deed in txn.deed_number or target_deed in txn.transaction_ref)) or (not target_deed and txn.status == "PENDING_REGISTRATION"):
                txn.status = "CANCELLED"
                modified_count += 1
                scenario_explanation = f"Hypothetically marked deed '{txn.deed_number}' ({txn.transaction_ref}) as CANCELLED."
                break
        if modified_count == 0 and simulated_record.transactions:
            # Fallback: cancel the last transaction
            simulated_record.transactions[-1].status = "CANCELLED"
            scenario_explanation = f"Hypothetically marked deed '{simulated_record.transactions[-1].deed_number}' as CANCELLED."

    elif scenario == "RESOLVE_MUTATION":
        for mut in simulated_record.mutations:
            mut.status = "APPROVED"
            mut.remarks = "Namzari mutation verified and certified by AC Land office."
            if simulated_record.recorded_owner:
                mut.applicant_name = simulated_record.recorded_owner.full_name
        scenario_explanation = "Hypothetically resolved mutation discrepancies and aligned applicant with recorded owner."

    elif scenario == "CORRECT_CHAIN":
        # Ensure chronological sellers match preceding buyers
        for i in range(1, len(simulated_record.transactions)):
            prev = simulated_record.transactions[i - 1]
            curr = simulated_record.transactions[i]
            curr.seller_id = prev.buyer_id
            curr.seller = prev.buyer
        scenario_explanation = "Hypothetically corrected Baya deed chain so each seller matches the preceding verified buyer."

    elif scenario == "RESOLVE_ALL":
        for txn in simulated_record.transactions:
            if txn.status in ["PENDING_REGISTRATION", "UNDER_REVIEW"]:
                txn.status = "CANCELLED"
        for mut in simulated_record.mutations:
            mut.status = "APPROVED"
        scenario_explanation = "Hypothetically eliminated pending double-selling registrations and reconciled mutation records."

    # 4. Re-evaluate using actual detection rules
    simulated_result = engine.evaluate(simulated_record)

    # 5. Compute deltas
    score_delta = simulated_result.risk_score - baseline_result.risk_score
    baseline_rules = set(baseline_result.triggered_rules)
    simulated_rules = set(simulated_result.triggered_rules)
    resolved_rules = list(baseline_rules - simulated_rules)
    remaining_rules = list(simulated_rules)

    rule_names_map = {
        "CONFLICTING_ACTIVE_SALES": "Double-Selling Detection",
        "CONFLICTING_OWNERSHIP_TRANSFERS": "Duplicate Conveyance",
        "OWNERSHIP_CHAIN_INCONSISTENCY": "Ownership Chain Continuity",
        "MUTATION_MISMATCH": "Registration-Mutation Mismatch",
        "DOC_HASH_MISMATCH": "Document Integrity (SHA-256)",
        "MISSING_SUPPORTING_DATA": "Record Completeness",
        "DUPLICATE_TXN_REF": "Deed Serial Uniqueness"
    }

    rule_status_comparison = []
    all_rules = list(baseline_rules.union(simulated_rules))
    for r in all_rules:
        name = rule_names_map.get(r, r)
        before_active = r in baseline_rules
        after_active = r in simulated_rules
        rule_status_comparison.append({
            "rule_code": r,
            "rule_name": name,
            "before_status": "High Risk" if "ACTIVE_SALES" in r or "HASH" in r else "Mismatch" if "MUTATION" in r else "Medium",
            "after_status": "Resolved" if not after_active else ("High Risk" if "ACTIVE_SALES" in r else "Mismatch"),
            "resolved": not after_active
        })

    return jsonify({
        "success": True,
        "is_synthetic_simulation": True,
        "record_id": record.record_id,
        "scenario": scenario,
        "scenario_explanation": scenario_explanation,
        "available_deeds": [
            {"id": t.id, "deed_number": t.deed_number, "status": t.status, "date": t.deed_date.isoformat() if t.deed_date else None}
            for t in (record.transactions or [])
        ],
        "before": {
            "score": baseline_result.risk_score,
            "risk_band": baseline_result.risk_band,
            "status": baseline_result.screening_status,
            "triggered_rules": baseline_result.triggered_rules
        },
        "after": {
            "score": simulated_result.risk_score,
            "risk_band": simulated_result.risk_band,
            "status": simulated_result.screening_status,
            "triggered_rules": simulated_result.triggered_rules
        },
        "score_delta": score_delta,
        "resolved_rules": resolved_rules,
        "remaining_rules": remaining_rules,
        "rule_comparison": rule_status_comparison,
        "disclaimer": (
            "Hypothetical What-If analysis calculated in an isolated sandbox. "
            "Original database records were not modified. Algorithmic scores do not resolve legal disputes."
        )
    })
