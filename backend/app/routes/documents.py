from flask import Blueprint, jsonify, request
from app.models.models import DocumentReference
from app.services.document_service import verify_document_integrity

documents_bp = Blueprint("documents", __name__)

@documents_bp.route("/verify-hash", methods=["POST"])
def verify_hash():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file part in request"}), 400

    uploaded_file = request.files["file"]
    if uploaded_file.filename == "":
        return jsonify({"success": False, "error": "No file selected"}), 400

    reference_hash = request.form.get("reference_hash", "").strip()
    doc_id = request.form.get("document_id")

    if not reference_hash and doc_id:
        doc_ref = DocumentReference.query.get(doc_id)
        if doc_ref:
            reference_hash = doc_ref.reference_hash

    if not reference_hash:
        return jsonify({
            "success": False,
            "error": "Reference hash or valid document_id is required for verification"
        }), 400

    result = verify_document_integrity(uploaded_file, reference_hash)
    if not result.get("success"):
        return jsonify(result), 400

    return jsonify(result), 200

@documents_bp.route("/references", methods=["GET"])
def get_sample_document_references():
    docs = DocumentReference.query.limit(20).all()
    return jsonify({
        "success": True,
        "documents": [d.to_dict() for d in docs]
    })
