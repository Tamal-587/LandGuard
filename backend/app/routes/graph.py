from flask import Blueprint, jsonify, request
from app.models.models import LandRecord, OwnershipTransaction, MutationHistory, FraudAlert, SyntheticOwner

graph_bp = Blueprint("graph", __name__)

@graph_bp.route("/<record_id>", methods=["GET"])
def get_record_graph(record_id):
    # Lookup land record
    record = None
    if record_id.isdigit():
        record = LandRecord.query.get(int(record_id))
    if not record:
        record = LandRecord.query.filter_by(record_id=record_id).first()
    if not record:
        # Fallback to first high-risk record or first record
        record = LandRecord.query.filter(LandRecord.record_status.ilike("%Disputed%")).first() or LandRecord.query.first()

    if not record:
        return jsonify({"success": False, "error": "No land records found"}), 404

    nodes = []
    edges = []

    # 1. Central Parcel Node
    parcel_node_id = f"parcel_{record.id}"
    nodes.append({
        "id": parcel_node_id,
        "type": "parcel",
        "label": f"Land Parcel\n{record.record_id}",
        "sublabel": f"Dag: {record.plot_no} | Khatian: {record.khatian_no}\nArea: {record.area_acres * 100:.1f} Dec",
        "title": f"Parcel {record.record_id}",
        "district": record.district,
        "mouza": record.mouza,
        "status": record.record_status,
        "details": record.to_dict()
    })

    # 2. Deed Transaction Nodes & Edges
    txns = record.transactions or []
    txn_nodes = {}
    active_sales = []

    for txn in txns:
        t_node_id = f"deed_{txn.id}"
        txn_nodes[txn.id] = t_node_id
        is_pending = txn.status in ["PENDING_REGISTRATION", "UNDER_REVIEW"]
        if is_pending:
            active_sales.append(txn)

        nodes.append({
            "id": t_node_id,
            "type": "deed",
            "label": f"Deed {txn.deed_number}\n{txn.deed_date.strftime('%d %b %Y') if txn.deed_date else 'N/A'}",
            "sublabel": f"Ref: {txn.transaction_ref}\nOffice: {txn.registration_office}",
            "title": f"Sale Deed {txn.deed_number}",
            "deed_number": txn.deed_number,
            "status": txn.status,
            "date": txn.deed_date.isoformat() if txn.deed_date else None,
            "value_bdt": txn.transaction_value_bdt,
            "details": txn.to_dict()
        })

        # Edge from Parcel to Deed
        edges.append({
            "id": f"e_p_{txn.id}",
            "source": parcel_node_id,
            "target": t_node_id,
            "label": "Conveyance",
            "is_conflict": False,
            "style": "solid"
        })

        # Buyer Node
        if txn.buyer:
            buyer_node_id = f"owner_{txn.buyer.id}"
            if not any(n["id"] == buyer_node_id for n in nodes):
                nodes.append({
                    "id": buyer_node_id,
                    "type": "owner",
                    "label": f"Buyer: {txn.buyer.full_name.replace(' (Synthetic)', '')}",
                    "sublabel": f"NID: ***{txn.buyer.synthetic_id_label[-4:] if txn.buyer.synthetic_id_label else '1234'}",
                    "title": txn.buyer.full_name,
                    "phone": txn.buyer.phone_masked,
                    "details": txn.buyer.to_dict()
                })
            # Edge from Deed to Buyer
            edges.append({
                "id": f"e_d_b_{txn.id}",
                "source": t_node_id,
                "target": buyer_node_id,
                "label": "Transferred To",
                "is_conflict": False,
                "style": "solid"
            })

    # Detect & Highlight Conflicting Sales (Double-Selling)
    if len(active_sales) > 1:
        for i in range(len(active_sales)):
            for j in range(i + 1, len(active_sales)):
                edges.append({
                    "id": f"conflict_{active_sales[i].id}_{active_sales[j].id}",
                    "source": f"deed_{active_sales[i].id}",
                    "target": f"deed_{active_sales[j].id}",
                    "label": "Conflicting Sales (Same Land)",
                    "is_conflict": True,
                    "style": "dashed",
                    "color": "#EF4444"
                })

    # 3. Mutation History Nodes & Edges
    mutations = record.mutations or []
    for mut in mutations:
        mut_node_id = f"mut_{mut.id}"
        is_mismatch = mut.status == "IRREGULAR"
        nodes.append({
            "id": mut_node_id,
            "type": "mutation",
            "label": f"Mutation Record\n{mut.application_date.strftime('%d %b %Y') if mut.application_date else 'N/A'}",
            "sublabel": f"Case: {mut.mutation_case_no}\nApplicant: {mut.applicant_name.replace(' (Synthetic)', '')}",
            "title": f"AC Land Mutation {mut.mutation_case_no}",
            "status": mut.status,
            "applicant": mut.applicant_name,
            "previous_owner": mut.previous_owner_name,
            "ac_land_office": mut.ac_land_office,
            "remarks": mut.remarks,
            "details": mut.to_dict()
        })

        # Connect mutation to parcel or transaction
        target_deed = txn_nodes.get(mut.transaction_id)
        if target_deed:
            edges.append({
                "id": f"e_m_t_{mut.id}",
                "source": target_deed,
                "target": mut_node_id,
                "label": "Mutation Record" if not is_mismatch else "Mutation Mismatch",
                "is_conflict": is_mismatch,
                "style": "dashed" if is_mismatch else "solid",
                "color": "#F97316" if is_mismatch else None
            })
        else:
            edges.append({
                "id": f"e_m_p_{mut.id}",
                "source": parcel_node_id,
                "target": mut_node_id,
                "label": "Mutation History",
                "is_conflict": is_mismatch,
                "style": "dashed" if is_mismatch else "solid",
                "color": "#F97316" if is_mismatch else None
            })

    return jsonify({
        "success": True,
        "record_id": record.record_id,
        "nodes": nodes,
        "edges": edges,
        "summary": {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "conflicts_count": sum(1 for e in edges if e.get("is_conflict"))
        }
    })
