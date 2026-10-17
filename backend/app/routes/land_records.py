from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from app.models.models import LandRecord, SyntheticOwner

land_records_bp = Blueprint("land_records", __name__)

@land_records_bp.route("", methods=["GET"])
def get_land_records():
    limit = request.args.get("limit", default=50, type=int)
    offset = request.args.get("offset", default=0, type=int)
    status_filter = request.args.get("status", default=None, type=str)
    district_filter = request.args.get("district", default=None, type=str)

    query = LandRecord.query
    if status_filter:
        query = query.filter(LandRecord.record_status.ilike(f"%{status_filter}%"))
    if district_filter:
        query = query.filter(LandRecord.district.ilike(f"%{district_filter}%"))

    total = query.count()
    records = query.order_by(LandRecord.id.asc()).offset(offset).limit(limit).all()

    return jsonify({
        "success": True,
        "total": total,
        "limit": limit,
        "offset": offset,
        "records": [r.to_dict() for r in records]
    })

@land_records_bp.route("/search", methods=["GET"])
def search_land_records():
    query_str = request.args.get("q", default="", type=str).strip()
    district = request.args.get("district", default="", type=str).strip()
    upazila = request.args.get("upazila", default="", type=str).strip()
    mouza = request.args.get("mouza", default="", type=str).strip()
    dag_no = request.args.get("dag_no", default="", type=str).strip() or request.args.get("plot_no", default="", type=str).strip()
    khatian_no = request.args.get("khatian_no", default="", type=str).strip()
    deed_number = request.args.get("deed_number", default="", type=str).strip()

    query = LandRecord.query.outerjoin(SyntheticOwner, LandRecord.recorded_owner_id == SyntheticOwner.id)

    if deed_number:
        from app.models.models import OwnershipTransaction
        query = query.join(OwnershipTransaction, LandRecord.id == OwnershipTransaction.land_record_id)
        query = query.filter(OwnershipTransaction.deed_number.ilike(f"%{deed_number}%"))

    if district:
        query = query.filter(LandRecord.district.ilike(f"%{district}%"))
    if upazila:
        # Upazila can match mouza or division or record_id
        query = query.filter(or_(LandRecord.mouza.ilike(f"%{upazila}%"), LandRecord.division.ilike(f"%{upazila}%")))
    if mouza:
        query = query.filter(LandRecord.mouza.ilike(f"%{mouza}%"))
    if dag_no:
        query = query.filter(or_(LandRecord.plot_no.ilike(f"%{dag_no}%"), LandRecord.record_id.ilike(f"%{dag_no}%")))
    if khatian_no:
        query = query.filter(LandRecord.khatian_no.ilike(f"%{khatian_no}%"))

    if query_str:
        search_pattern = f"%{query_str}%"
        query = query.filter(
            or_(
                LandRecord.record_id.ilike(search_pattern),
                LandRecord.khatian_no.ilike(search_pattern),
                LandRecord.plot_no.ilike(search_pattern),
                LandRecord.mouza.ilike(search_pattern),
                LandRecord.district.ilike(search_pattern),
                SyntheticOwner.full_name.ilike(search_pattern)
            )
        )

    results = query.distinct().limit(40).all()

    return jsonify({
        "success": True,
        "query": query_str,
        "total": len(results),
        "records": [r.to_dict() for r in results]
    })

@land_records_bp.route("/<record_id>", methods=["GET"])
def get_land_record_detail(record_id):
    # Lookup by record_id string (e.g. "LR-DHK-2024-001") or numeric ID
    record = None
    if record_id.isdigit():
        record = LandRecord.query.get(int(record_id))
    if not record:
        record = LandRecord.query.filter_by(record_id=record_id).first()

    if not record:
        return jsonify({
            "success": False,
            "error": f"Land record '{record_id}' not found."
        }), 404

    return jsonify({
        "success": True,
        "record": record.to_dict(include_nested=True)
    })

@land_records_bp.route("/<record_id>/transactions", methods=["GET"])
def get_record_transactions(record_id):
    record = LandRecord.query.filter_by(record_id=record_id).first()
    if not record:
        return jsonify({"success": False, "error": "Land record not found"}), 404

    return jsonify({
        "success": True,
        "record_id": record.record_id,
        "transactions": [t.to_dict() for t in record.transactions]
    })

@land_records_bp.route("/<record_id>/mutations", methods=["GET"])
def get_record_mutations(record_id):
    record = LandRecord.query.filter_by(record_id=record_id).first()
    if not record:
        return jsonify({"success": False, "error": "Land record not found"}), 404

    return jsonify({
        "success": True,
        "record_id": record.record_id,
        "mutations": [m.to_dict() for m in record.mutations]
    })
