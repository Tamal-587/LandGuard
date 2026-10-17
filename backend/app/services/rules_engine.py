"""
LandGuard Fraud & Double-Selling Detection Rule Engine
Configurable, transparent, and explainable prototype detection service.
"""

from dataclasses import dataclass, field
from datetime import date, datetime
from typing import List, Dict, Any, Optional

RULE_CONFIG = {
    "CONFLICTING_ACTIVE_SALES": {
        "points": 40,
        "name": "Conflicting Active Sales",
        "category": "DOUBLE_SELLING"
    },
    "CONFLICTING_OWNERSHIP_TRANSFERS": {
        "points": 30,
        "name": "Conflicting Ownership Transfers",
        "category": "TRANSFER_CONFLICT"
    },
    "OWNERSHIP_CHAIN_INCONSISTENCY": {
        "points": 20,
        "name": "Ownership Chain Inconsistency",
        "category": "CHAIN_INTEGRITY"
    },
    "MUTATION_MISMATCH": {
        "points": 15,
        "name": "Mutation Record Inconsistency",
        "category": "MUTATION_INTEGRITY"
    },
    "DOC_HASH_MISMATCH": {
        "points": 20,
        "name": "Document Integrity Mismatch",
        "category": "DOCUMENT_INTEGRITY"
    },
    "MISSING_SUPPORTING_DATA": {
        "points": 10,
        "name": "Missing Required Supporting Information",
        "category": "DATA_COMPLETENESS"
    },
    "DUPLICATE_TXN_REF": {
        "points": 15,
        "name": "Duplicate Transaction Reference",
        "category": "TRANSACTION_INTEGRITY"
    }
}

@dataclass
class Finding:
    rule_code: str
    rule_name: str
    points: int
    severity: str  # HIGH, MEDIUM, LOW
    title: str
    explanation: str
    evidence: Dict[str, Any] = field(default_factory=dict)
    suggested_action: str = ""

@dataclass
class ScreeningResult:
    land_record_id: int
    record_identifier: str
    risk_score: int
    risk_band: str  # LOW, MEDIUM, HIGH
    screening_status: str
    checks_performed: List[Dict[str, str]]
    findings: List[Finding]
    triggered_rules: List[str]
    recommended_next_steps: str
    disclaimer: str

    def to_dict(self):
        return {
            "land_record_id": self.land_record_id,
            "record_identifier": self.record_identifier,
            "risk_score": self.risk_score,
            "risk_band": self.risk_band,
            "screening_status": self.screening_status,
            "checks_performed": self.checks_performed,
            "findings": [
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
                for f in self.findings
            ],
            "triggered_rules": self.triggered_rules,
            "recommended_next_steps": self.recommended_next_steps,
            "disclaimer": self.disclaimer
        }

class FraudDetectionEngine:
    """
    Evaluates synthetic land records against integrity and double-selling rules.
    Does not assume a record is legally authentic merely because it exists.
    """

    def __init__(self, custom_config: Optional[Dict[str, Any]] = None):
        self.config = custom_config or RULE_CONFIG

    def evaluate(self, land_record, all_transactions=None) -> ScreeningResult:
        findings: List[Finding] = []
        checks_performed: List[Dict[str, str]] = []
        triggered_rules_set = set()

        transactions = land_record.transactions or []
        mutations = land_record.mutations or []
        documents = land_record.documents or []

        # Sort transactions chronologically by deed_date ascending
        sorted_txns = sorted(
            transactions,
            key=lambda t: t.deed_date if isinstance(t.deed_date, date) else date.min
        )

        # -------------------------------------------------------------
        # Check 1: Record Completeness & Supporting Information
        # -------------------------------------------------------------
        checks_performed.append({
            "check_id": "CHK_DATA_COMPLETENESS",
            "name": "Record & Supporting Data Completeness",
            "description": "Validates essential parcel attributes, owner profiles, and transaction references."
        })
        missing_data_issues = []
        if not land_record.khatian_no or land_record.khatian_no.strip() == "":
            missing_data_issues.append("Missing or unassigned Khatian number")
        if not land_record.plot_no or land_record.plot_no.strip() == "":
            missing_data_issues.append("Missing Plot number specification")
        if not land_record.recorded_owner_id:
            missing_data_issues.append("No active recorded owner profile assigned to land record")

        for txn in transactions:
            if not txn.deed_number or txn.deed_number.strip() == "":
                missing_data_issues.append(f"Transaction {txn.transaction_ref} lacks official deed number")
            if not txn.buyer_id:
                missing_data_issues.append(f"Transaction {txn.transaction_ref} has undefined buyer identity")

        if missing_data_issues and "MISSING_SUPPORTING_DATA" not in triggered_rules_set:
            rule_info = self.config["MISSING_SUPPORTING_DATA"]
            findings.append(Finding(
                rule_code="MISSING_SUPPORTING_DATA",
                rule_name=rule_info["name"],
                points=rule_info["points"],
                severity="MEDIUM",
                title="Incomplete Parcel or Supporting Transaction Data",
                explanation=f"Screening identified {len(missing_data_issues)} missing critical field(s): {', '.join(missing_data_issues[:3])}.",
                evidence={"issues": missing_data_issues, "record_id": land_record.record_id},
                suggested_action="Request verified land schedule and complete sub-registry transaction entries before proceeding."
            ))
            triggered_rules_set.add("MISSING_SUPPORTING_DATA")

        # -------------------------------------------------------------
        # Check 2: Conflicting Active Sales (Core Double-Selling Rule)
        # -------------------------------------------------------------
        checks_performed.append({
            "check_id": "CHK_CONFLICTING_ACTIVE_SALES",
            "name": "Conflicting Active Sales Check",
            "description": "Detects concurrent pending or active deed registrations on the same land parcel."
        })
        # Active sales are transactions that are pending registration or under review (not CANCELLED or COMPLETED)
        active_sales = [
            t for t in transactions
            if t.status in ["PENDING_REGISTRATION", "UNDER_REVIEW"]
        ]

        if len(active_sales) > 1 and "CONFLICTING_ACTIVE_SALES" not in triggered_rules_set:
            rule_info = self.config["CONFLICTING_ACTIVE_SALES"]
            active_refs = [f"{t.transaction_ref} (Deed: {t.deed_number}, Buyer ID: {t.buyer_id})" for t in active_sales]
            findings.append(Finding(
                rule_code="CONFLICTING_ACTIVE_SALES",
                rule_name=rule_info["name"],
                points=rule_info["points"],
                severity="HIGH",
                title="Suspicious Concurrent Active Sales Detected",
                explanation=(
                    f"Found {len(active_sales)} concurrent active/pending sale transactions for parcel "
                    f"'{land_record.record_id}'. This indicates potential double-selling attempt where "
                    f"the same parcel is being contracted to multiple buyers simultaneously."
                ),
                evidence={
                    "conflicting_transactions": [
                        {
                            "ref": t.transaction_ref,
                            "deed_number": t.deed_number,
                            "buyer": t.buyer.full_name if t.buyer else f"ID {t.buyer_id}",
                            "status": t.status,
                            "date": t.deed_date.isoformat() if t.deed_date else None
                        }
                        for t in active_sales
                    ]
                },
                suggested_action="Immediate freeze on deed registration. Inquire with Sub-Registry Office and AC Land to verify genuine deed submissions."
            ))
            triggered_rules_set.add("CONFLICTING_ACTIVE_SALES")

        # -------------------------------------------------------------
        # Check 3: Conflicting Ownership Transfers (Completed Overlaps)
        # -------------------------------------------------------------
        checks_performed.append({
            "check_id": "CHK_CONFLICTING_TRANSFERS",
            "name": "Conflicting Ownership Transfers Check",
            "description": "Flags overlapping completed transfers executed to different buyers without prior chain resolution."
        })
        completed_txns = [t for t in sorted_txns if t.status == "COMPLETED"]
        # Check if there are completed sales from the same seller to different buyers within an anomalous or overlapping timeframe
        overlapping_found = False
        overlapping_evidence = []
        for i in range(len(completed_txns)):
            for j in range(i + 1, len(completed_txns)):
                t1 = completed_txns[i]
                t2 = completed_txns[j]
                # If same seller sold to two different buyers, but t2 did not acquire from t1's buyer
                if t1.seller_id and t2.seller_id and t1.seller_id == t2.seller_id and t1.buyer_id != t2.buyer_id:
                    # Seller sold it, then allegedly sold it again to someone else without buying it back!
                    overlapping_found = True
                    overlapping_evidence.append({
                        "earlier_sale": {
                            "ref": t1.transaction_ref,
                            "deed_number": t1.deed_number,
                            "buyer": t1.buyer.full_name if t1.buyer else f"ID {t1.buyer_id}",
                            "date": t1.deed_date.isoformat() if t1.deed_date else None
                        },
                        "conflicting_sale": {
                            "ref": t2.transaction_ref,
                            "deed_number": t2.deed_number,
                            "buyer": t2.buyer.full_name if t2.buyer else f"ID {t2.buyer_id}",
                            "date": t2.deed_date.isoformat() if t2.deed_date else None
                        },
                        "seller": t1.seller.full_name if t1.seller else f"ID {t1.seller_id}"
                    })

        if overlapping_found and "CONFLICTING_OWNERSHIP_TRANSFERS" not in triggered_rules_set:
            rule_info = self.config["CONFLICTING_OWNERSHIP_TRANSFERS"]
            findings.append(Finding(
                rule_code="CONFLICTING_OWNERSHIP_TRANSFERS",
                rule_name=rule_info["name"],
                points=rule_info["points"],
                severity="HIGH",
                title="Conflicting Prior Transfer Detected (Duplicate Conveyance)",
                explanation=(
                    f"Historical transaction records show the same seller conveyed parcel '{land_record.record_id}' "
                    f"to multiple distinct buyers in separate completed deeds without intermediary reconveyance."
                ),
                evidence={"conflicts": overlapping_evidence},
                suggested_action="Review Volume (Balam) registers at the relevant District Registrar office to confirm authentic deed enrollment."
            ))
            triggered_rules_set.add("CONFLICTING_OWNERSHIP_TRANSFERS")

        # -------------------------------------------------------------
        # Check 4: Ownership Chain Chronology & Continuity
        # -------------------------------------------------------------
        checks_performed.append({
            "check_id": "CHK_OWNERSHIP_CHAIN",
            "name": "Ownership Chain Continuity Check",
            "description": "Ensures the seller in each deed matches the legitimate prior buyer or recorded owner in chronological sequence."
        })
        chain_broken = False
        chain_issues = []
        for idx, txn in enumerate(sorted_txns):
            # We ignore cancelled transactions for chain breaks
            if txn.status == "CANCELLED":
                continue
            if idx > 0:
                prev_completed = [
                    t for t in sorted_txns[:idx] 
                    if t.status == "COMPLETED"
                ]
                if prev_completed:
                    expected_owner_id = prev_completed[-1].buyer_id
                    if txn.seller_id and txn.seller_id != expected_owner_id:
                        chain_broken = True
                        prev_buyer_name = prev_completed[-1].buyer.full_name if prev_completed[-1].buyer else f"ID {expected_owner_id}"
                        curr_seller_name = txn.seller.full_name if txn.seller else f"ID {txn.seller_id}"
                        chain_issues.append({
                            "transaction_ref": txn.transaction_ref,
                            "deed_number": txn.deed_number,
                            "alleged_seller": curr_seller_name,
                            "expected_owner": prev_buyer_name,
                            "prior_transaction": prev_completed[-1].transaction_ref,
                            "explanation": f"Seller '{curr_seller_name}' does not match prior buyer '{prev_buyer_name}'."
                        })

        if chain_broken and "OWNERSHIP_CHAIN_INCONSISTENCY" not in triggered_rules_set:
            rule_info = self.config["OWNERSHIP_CHAIN_INCONSISTENCY"]
            findings.append(Finding(
                rule_code="OWNERSHIP_CHAIN_INCONSISTENCY",
                rule_name=rule_info["name"],
                points=rule_info["points"],
                severity="MEDIUM",
                title="Discontinuous Ownership Chain Detected",
                explanation=(
                    f"The seller in deed record(s) does not match the recipient of the preceding completed transfer. "
                    f"There may be an unrecorded deed, heirship gap, or fraudulent conveyance attempt."
                ),
                evidence={"chain_inconsistencies": chain_issues},
                suggested_action="Request certified chain of title deeds (Baya deeds) and inheritance succession certificates."
            ))
            triggered_rules_set.add("OWNERSHIP_CHAIN_INCONSISTENCY")

        # -------------------------------------------------------------
        # Check 5: Duplicate Transaction References
        # -------------------------------------------------------------
        checks_performed.append({
            "check_id": "CHK_DUPLICATE_TXN",
            "name": "Duplicate Transaction Reference Check",
            "description": "Verifies uniqueness of deed numbers and transaction reference tokens."
        })
        deed_numbers = [t.deed_number.strip() for t in transactions if t.deed_number]
        duplicate_deeds = set([d for d in deed_numbers if deed_numbers.count(d) > 1])
        if duplicate_deeds and "DUPLICATE_TXN_REF" not in triggered_rules_set:
            rule_info = self.config["DUPLICATE_TXN_REF"]
            findings.append(Finding(
                rule_code="DUPLICATE_TXN_REF",
                rule_name=rule_info["name"],
                points=rule_info["points"],
                severity="MEDIUM",
                title="Suspicious Duplicate Deed / Transaction Reference Found",
                explanation=f"Multiple transaction records share identical deed number(s): {', '.join(duplicate_deeds)}.",
                evidence={"duplicate_deeds": list(duplicate_deeds)},
                suggested_action="Cross-verify the volume and page number with the Sub-Registry index book."
            ))
            triggered_rules_set.add("DUPLICATE_TXN_REF")

        # -------------------------------------------------------------
        # Check 6: Mutation Record Consistency & Alignment
        # -------------------------------------------------------------
        checks_performed.append({
            "check_id": "CHK_MUTATION_ALIGNMENT",
            "name": "Mutation History Consistency Check",
            "description": "Cross-references mutation cases against transfer deeds and recorded ownership."
        })
        mutation_issues = []
        approved_mutations = [m for m in mutations if m.status == "APPROVED"]
        
        # Scenario A: Completed transactions with no mutation record after 180 days
        for txn in completed_txns:
            matching_mutations = [
                m for m in mutations 
                if m.transaction_id == txn.id or (m.applicant_name and txn.buyer and m.applicant_name.lower() in txn.buyer.full_name.lower())
            ]
            if not matching_mutations:
                # Check how old the transaction is
                txn_date = txn.deed_date if isinstance(txn.deed_date, date) else date.today()
                days_elapsed = (date.today() - txn_date).days
                if days_elapsed > 180:
                    mutation_issues.append(
                        f"Completed transaction {txn.transaction_ref} (Deed: {txn.deed_number}) has no associated mutation case after {days_elapsed} days."
                    )

        # Scenario B: Mutation references unknown transaction or irregular status
        for mut in mutations:
            if mut.status == "IRREGULAR":
                mutation_issues.append(
                    f"Mutation case {mut.mutation_case_no} flagged as 'IRREGULAR' by AC Land office audit: {mut.remarks or 'Discrepancy noted'}."
                )
            elif mut.transaction_id:
                # Check if transaction exists in this parcel
                txn_exists = any(t.id == mut.transaction_id for t in transactions)
                if not txn_exists:
                    mutation_issues.append(
                        f"Mutation case {mut.mutation_case_no} references transaction ID {mut.transaction_id} which does not exist for this parcel."
                    )

        # Scenario C: Discrepancy between recorded owner and most recent approved mutation applicant
        if approved_mutations and land_record.recorded_owner:
            latest_approved_mutation = sorted(
                approved_mutations,
                key=lambda m: m.approval_date if m.approval_date else m.application_date
            )[-1]
            if (
                latest_approved_mutation.applicant_name 
                and land_record.recorded_owner.full_name.strip().lower() != latest_approved_mutation.applicant_name.strip().lower()
            ):
                mutation_issues.append(
                    f"Current recorded owner '{land_record.recorded_owner.full_name}' does not match latest approved mutation applicant '{latest_approved_mutation.applicant_name}' (Case: {latest_approved_mutation.mutation_case_no})."
                )

        if mutation_issues and "MUTATION_MISMATCH" not in triggered_rules_set:
            rule_info = self.config["MUTATION_MISMATCH"]
            findings.append(Finding(
                rule_code="MUTATION_MISMATCH",
                rule_name=rule_info["name"],
                points=rule_info["points"],
                severity="MEDIUM",
                title="Mutation Record Inconsistency / Missing Mutation",
                explanation=f"Identified {len(mutation_issues)} mutation discrepancy/discrepancies: {'; '.join(mutation_issues[:2])}.",
                evidence={"mutation_issues": mutation_issues},
                suggested_action="Consult the local Assistant Commissioner (Land) office to obtain certified Namzari (mutation) verification."
            ))
            triggered_rules_set.add("MUTATION_MISMATCH")

        # -------------------------------------------------------------
        # Check 7: Document Integrity (SHA-256 Reference Status)
        # -------------------------------------------------------------
        checks_performed.append({
            "check_id": "CHK_DOCUMENT_INTEGRITY",
            "name": "Document Hash Integrity Check",
            "description": "Reviews registered SHA-256 cryptographic hashes for recorded land deeds and Porchas."
        })
        mismatched_docs = [d for d in documents if not d.verified_hash]
        if mismatched_docs and "DOC_HASH_MISMATCH" not in triggered_rules_set:
            rule_info = self.config["DOC_HASH_MISMATCH"]
            findings.append(Finding(
                rule_code="DOC_HASH_MISMATCH",
                rule_name=rule_info["name"],
                points=rule_info["points"],
                severity="HIGH",
                title="Document SHA-256 Hash Integrity Mismatch",
                explanation=(
                    f"{len(mismatched_docs)} document(s) on file failed cryptographic checksum verification against "
                    f"the stored reference hash. File content may have been altered, corrupted, or replaced."
                ),
                evidence={
                    "compromised_documents": [
                        {
                            "doc_title": d.doc_title,
                            "doc_type": d.doc_type,
                            "file_name": d.file_name,
                            "stored_hash": d.reference_hash
                        }
                        for d in mismatched_docs
                    ]
                },
                suggested_action="Re-scan and re-verify deed porcha directly from original Sub-Registry archive files."
            ))
            triggered_rules_set.add("DOC_HASH_MISMATCH")

        # -------------------------------------------------------------
        # Final Score Calculation (Capped at 100)
        # -------------------------------------------------------------
        raw_score = sum(f.points for f in findings)
        final_score = min(raw_score, 100)

        # Risk Bands:
        # 0-19: Low
        # 20-49: Medium
        # 50-100: High
        if final_score >= 50:
            risk_band = "HIGH"
            screening_status = "High Risk Alert — Potential Conflict Detected"
            recommended_next_steps = (
                "Do not initiate payment, deed execution, or mutation transfer. "
                "Conduct an in-person physical inspection of the plot, demand certified copies of Baya deeds from Sub-Registry, "
                "and verify AC Land mutation records directly."
            )
        elif final_score >= 20:
            risk_band = "MEDIUM"
            screening_status = "Medium Risk Warning — Inconsistencies Require Review"
            recommended_next_steps = (
                "Review flagged mutation entries and missing supporting documents. "
                "Request updated Dakhila (land development tax receipt) and Khatian verification from Upazila AC Land office."
            )
        else:
            risk_band = "LOW"
            screening_status = "No Conflict Detected in Available Demo Records"
            recommended_next_steps = (
                "No ownership clashes or double-selling flags found in synthetic demo dataset. "
                "Standard due diligence and legal title search still recommended before transaction closing."
            )

        disclaimer = (
            "Screening results are rule-based prototype indicators derived strictly from synthetic demonstration data. "
            "They do not establish legal title, certify a real deed, or prove that any person committed fraud. "
            "A low score is not proof that a transaction is safe."
        )

        return ScreeningResult(
            land_record_id=land_record.id,
            record_identifier=land_record.record_id,
            risk_score=final_score,
            risk_band=risk_band,
            screening_status=screening_status,
            checks_performed=checks_performed,
            findings=findings,
            triggered_rules=list(triggered_rules_set),
            recommended_next_steps=recommended_next_steps,
            disclaimer=disclaimer
        )
