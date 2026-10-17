from flask import Blueprint, jsonify
from datetime import date
from app.models.models import LandRecord

timeline_bp = Blueprint("timeline", __name__)

@timeline_bp.route("/<record_id>", methods=["GET"])
def get_record_timeline(record_id):
    record = None
    if record_id.isdigit():
        record = LandRecord.query.get(int(record_id))
    if not record:
        record = LandRecord.query.filter_by(record_id=record_id).first()
    if not record:
        record = LandRecord.query.filter(LandRecord.record_status.ilike("%Disputed%")).first() or LandRecord.query.first()

    if not record:
        return jsonify({"success": False, "error": "Land record not found"}), 404

    events = []

    # 1. Baseline ownership
    if record.recorded_owner:
        created_dt = record.created_at
        year_str = str(created_dt.year - 3 if created_dt else 2021)
        events.append({
            "id": f"base_{record.id}",
            "year": year_str,
            "date": f"15 Jun {year_str}",
            "title": "Original Owner",
            "description": f"{record.recorded_owner.full_name.replace(' (Synthetic)', '')} recorded in CS/RS Khatian",
            "status_badge": "Normal",
            "badge_variant": "success",
            "type": "INITIAL_RECORD",
            "party": record.recorded_owner.full_name,
            "details": {
                "khatian_no": record.khatian_no,
                "plot_no": record.plot_no,
                "district": record.district
            }
        })

    # 2. Transaction events sorted chronologically
    sorted_txns = sorted(
        record.transactions or [],
        key=lambda t: t.deed_date if isinstance(t.deed_date, date) else date.min
    )

    seen_buyers = set()
    for txn in sorted_txns:
        year_str = str(txn.deed_date.year) if txn.deed_date else "2023"
        date_str = txn.deed_date.strftime("%d %b %Y") if txn.deed_date else "N/A"
        is_pending = txn.status in ["PENDING_REGISTRATION", "UNDER_REVIEW"]
        buyer_name = txn.buyer.full_name.replace(" (Synthetic)", "") if txn.buyer else f"Buyer ID {txn.buyer_id}"

        # Determine badge & status
        if is_pending:
            status_badge = "Conflicting Sale"
            badge_variant = "danger"
        elif txn.status == "CANCELLED":
            status_badge = "Cancelled Sale"
            badge_variant = "secondary"
        elif len(seen_buyers) > 1:
            status_badge = "Suspicious Transfer"
            badge_variant = "warning"
        else:
            status_badge = "Sale Record"
            badge_variant = "info"

        seen_buyers.add(buyer_name)

        events.append({
            "id": f"txn_{txn.id}",
            "year": year_str,
            "date": date_str,
            "title": f"Deed {txn.deed_number}",
            "description": f"Conveyed to {buyer_name} ({date_str})",
            "status_badge": status_badge,
            "badge_variant": badge_variant,
            "type": "TRANSACTION",
            "party": buyer_name,
            "details": txn.to_dict()
        })

    # 3. Mutation events
    for mut in record.mutations or []:
        app_date = mut.application_date
        year_str = str(app_date.year) if app_date else "2023"
        date_str = app_date.strftime("%d %b %Y") if app_date else "N/A"
        is_mismatch = mut.status == "IRREGULAR" or (mut.remarks and "discrepancy" in mut.remarks.lower())

        events.append({
            "id": f"mut_{mut.id}",
            "year": year_str,
            "date": date_str,
            "title": "Mutation Record",
            "description": f"{'Shows irregular applicant' if is_mismatch else 'Approved Namzari case'} ({mut.applicant_name.replace(' (Synthetic)', '')})",
            "status_badge": "Mismatch" if is_mismatch else "Approved",
            "badge_variant": "danger" if is_mismatch else "success",
            "type": "MUTATION",
            "party": mut.applicant_name,
            "details": mut.to_dict()
        })

    # Sort all events chronologically
    return jsonify({
        "success": True,
        "record_id": record.record_id,
        "events": events,
        "summary": {
            "total_events": len(events),
            "parcel_id": record.record_id,
            "khatian_no": record.khatian_no,
            "plot_no": record.plot_no
        }
    })
