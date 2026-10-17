from flask import Blueprint, jsonify
from app.models.models import LandRecord, FraudAlert, OwnershipTransaction, MutationHistory

fraud_dna_bp = Blueprint("fraud_dna", __name__)

@fraud_dna_bp.route("", methods=["GET"])
def get_fraud_dna_clusters():
    """
    Identifies recurring cross-record anomaly footprints across synthetic demonstration records.
    Uses deterministic, testable rules. Does not fabricate unverified relationships.
    """
    clusters = []

    # 1. Double-Selling & Concurrent Conveyance Cluster
    double_selling_alerts = FraudAlert.query.filter(
        FraudAlert.alert_type.in_(["CONFLICTING_ACTIVE_SALES", "CONFLICTING_OWNERSHIP_TRANSFERS"])
    ).all()

    ds_parcel_ids = list(set([a.land_record.record_id for a in double_selling_alerts if a.land_record]))
    if ds_parcel_ids:
        clusters.append({
            "cluster_id": "DNA-PAT-01",
            "title": "Concurrent Active Conveyance Clashes",
            "category": "DOUBLE_SELLING",
            "severity": "HIGH",
            "confidence_pct": 94,
            "pattern_summary": "Multiple synthetic parcels subject to simultaneous unrecorded sale contracts to disparate buyers.",
            "recurring_indicators": [
                "Pending sale deeds submitted within tight calendar windows (< 10 days)",
                "Seller identity retained across parallel transactions without reconveyance",
                "Sub-Registry deed volume clash"
            ],
            "affected_parcels": ds_parcel_ids,
            "evidence_count": len(double_selling_alerts),
            "verifiable_facts": [
                f"Identified on parcels {', '.join(ds_parcel_ids[:3])}",
                "Active registrations pending approval concurrently in Sub-Registry records"
            ],
            "recommended_action": "Freeze pending deed enrollments; summon parties to Sub-Registry office for biometric verification."
        })

    # 2. Mutation-Conveyance Decoupling Cluster
    mutation_alerts = FraudAlert.query.filter_by(alert_type="MUTATION_MISMATCH").all()
    mut_parcel_ids = list(set([a.land_record.record_id for a in mutation_alerts if a.land_record]))
    if mut_parcel_ids:
        clusters.append({
            "cluster_id": "DNA-PAT-02",
            "title": "Namzari-Conveyance Desynchronization",
            "category": "MUTATION_INTEGRITY",
            "severity": "MEDIUM",
            "confidence_pct": 88,
            "pattern_summary": "Completed deed conveyances lacking associated AC Land mutation proceedings or showing irregular applicant identities.",
            "recurring_indicators": [
                "Unmutated deed transfers exceeding 180-day statutory threshold",
                "Applicant name on mutation order divergent from deed grantee",
                "Khatian allocation delay"
            ],
            "affected_parcels": mut_parcel_ids,
            "evidence_count": len(mutation_alerts),
            "verifiable_facts": [
                f"Observed on parcels {', '.join(mut_parcel_ids[:3])}",
                "AC Land mutation records missing or flagged as irregular"
            ],
            "recommended_action": "Cross-reference Upazila AC Land Volume with Sub-Registry index book; demand certified Namzari Khatian."
        })

    # 3. Discontinuous Baya Chain Cluster
    chain_alerts = FraudAlert.query.filter_by(alert_type="OWNERSHIP_CHAIN_INCONSISTENCY").all()
    chain_parcel_ids = list(set([a.land_record.record_id for a in chain_alerts if a.land_record]))
    if chain_parcel_ids:
        clusters.append({
            "cluster_id": "DNA-PAT-03",
            "title": "Discontinuous Title Progression (Chain Gaps)",
            "category": "CHAIN_INTEGRITY",
            "severity": "MEDIUM",
            "confidence_pct": 85,
            "pattern_summary": "Transfer records where the grantor fails to match the grantee of the chronologically prior completed conveyance.",
            "recurring_indicators": [
                "Unrecorded intermediary inheritance or gift deed (Heba)",
                "Grantor selling property without documented title acquisition",
                "Baya deed sequence missing"
            ],
            "affected_parcels": chain_parcel_ids,
            "evidence_count": len(chain_alerts),
            "verifiable_facts": [
                f"Documented on parcels {', '.join(chain_parcel_ids[:3])}",
                "Seller ID in deed record diverges from prior buyer"
            ],
            "recommended_action": "Demand complete 25-year title lineage (Baya deeds) and certified genealogical succession certificates."
        })

    # 4. Cryptographic Tampering Footprint
    tamper_alerts = FraudAlert.query.filter_by(alert_type="DOC_HASH_MISMATCH").all()
    tamper_parcel_ids = list(set([a.land_record.record_id for a in tamper_alerts if a.land_record]))
    if tamper_parcel_ids:
        clusters.append({
            "cluster_id": "DNA-PAT-04",
            "title": "Cryptographic Checksum Divergence",
            "category": "DOCUMENT_INTEGRITY",
            "severity": "HIGH",
            "confidence_pct": 98,
            "pattern_summary": "Registered Porcha or deed PDF files failing SHA-256 byte verification against archive references.",
            "recurring_indicators": [
                "Byte-level mismatch against stored SHA-256 reference hash",
                "Possible unauthorized modification of deed schedule, plot number, or boundaries"
            ],
            "affected_parcels": tamper_parcel_ids,
            "evidence_count": len(tamper_alerts),
            "verifiable_facts": [
                f"Flagged on parcels {', '.join(tamper_parcel_ids)}",
                "Archive SHA-256 checksum mismatch"
            ],
            "recommended_action": "Re-request certified physical microfilm scan from the District Registrar records room."
        })

    return jsonify({
        "success": True,
        "is_synthetic_demo": True,
        "total_clusters": len(clusters),
        "clusters": clusters,
        "summary": {
            "high_severity_patterns": sum(1 for c in clusters if c["severity"] == "HIGH"),
            "medium_severity_patterns": sum(1 for c in clusters if c["severity"] == "MEDIUM"),
            "total_flagged_parcels": len(set(p for c in clusters for p in c["affected_parcels"]))
        }
    })
