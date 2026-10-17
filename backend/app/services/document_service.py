import hashlib
import os
from typing import Dict, Any, Optional

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "tif", "tiff", "txt"}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def is_allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def calculate_sha256(file_stream) -> str:
    """Calculates SHA-256 checksum of uploaded binary stream safely in 64KB chunks."""
    sha256 = hashlib.sha256()
    file_stream.seek(0)
    while chunk := file_stream.read(65536):
        sha256.update(chunk)
    file_stream.seek(0)
    return sha256.hexdigest().lower()

def verify_document_integrity(uploaded_file, reference_hash: str) -> Dict[str, Any]:
    """
    Compares uploaded file SHA-256 with a reference hash.
    Does not store uploaded file permanently.
    """
    if not uploaded_file:
        return {"success": False, "error": "No file provided"}

    filename = uploaded_file.filename
    if not is_allowed_file(filename):
        return {
            "success": False,
            "error": f"Invalid file format. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        }

    computed_hash = calculate_sha256(uploaded_file.stream)
    clean_ref_hash = reference_hash.strip().lower()
    is_match = (computed_hash == clean_ref_hash)

    return {
        "success": True,
        "filename": filename,
        "computed_hash": computed_hash,
        "reference_hash": clean_ref_hash,
        "is_match": is_match,
        "status": "MATCH" if is_match else "MISMATCH",
        "explanation": (
            "Cryptographic SHA-256 hash matches the stored reference file byte-for-byte."
            if is_match
            else "Cryptographic SHA-256 hash differs from stored reference file. The file may have been altered or replaced."
        ),
        "disclaimer": (
            "A SHA-256 hash match indicates binary equivalence with the stored reference file only. "
            "It does not certify that the document has legal validity or authenticity."
        )
    }
