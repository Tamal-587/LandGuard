"""
Synthetic Demo Dataset for LandGuard Prototype
Strictly fictional records, fictional names, and synthetic identifiers.
Does not represent real individuals, live government registries, or authentic land deeds.
"""

import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from datetime import date, datetime, timedelta, timezone
from app.models.models import (
    db, SyntheticOwner, LandRecord, OwnershipTransaction,
    MutationHistory, DocumentReference, FraudAlert, VerificationReport, utcnow
)
from app.services.verification_service import run_land_record_verification


def seed_database():
    """Wipes and seeds the database with at least 20 fictional land records."""
    db.drop_all()
    db.create_all()

    # 1. Create synthetic owners (fictional names)
    owners_data = [
        {"id": "OWN-SYN-101", "name": "Mohammad Rafiqul Islam (Synthetic)", "nid": "SYN-NID-8829101", "phone": "+880-17XX-00101", "addr": "Plot 12, Road 4, Sector 7, Uttara, Dhaka (Demo)"},
        {"id": "OWN-SYN-102", "name": "Fatema Begum (Synthetic)", "nid": "SYN-NID-8829102", "phone": "+880-18XX-00102", "addr": "House 45, Dhanmondi 9/A, Dhaka (Demo)"},
        {"id": "OWN-SYN-103", "name": "Tanvir Ahmed Chowdhury (Synthetic)", "nid": "SYN-NID-8829103", "phone": "+880-19XX-00103", "addr": "Block C, Bashundhara R/A, Dhaka (Demo)"},
        {"id": "OWN-SYN-104", "name": "Nusrat Jahan (Synthetic)", "nid": "SYN-NID-8829104", "phone": "+880-17XX-00104", "addr": "Lane 3, Mirpur DOHS, Dhaka (Demo)"},
        {"id": "OWN-SYN-105", "name": "Kabir Hossain (Synthetic)", "nid": "SYN-NID-8829105", "phone": "+880-16XX-00105", "addr": "Road 11, Banani, Dhaka (Demo)"},
        {"id": "OWN-SYN-106", "name": "Salma Akter (Synthetic)", "nid": "SYN-NID-8829106", "phone": "+880-15XX-00106", "addr": "Holding 88, Badda, Dhaka (Demo)"},
        {"id": "OWN-SYN-107", "name": "Mahmudur Rahman (Synthetic)", "nid": "SYN-NID-8829107", "phone": "+880-17XX-00107", "addr": "Station Road, Tejgaon, Dhaka (Demo)"},
        {"id": "OWN-SYN-108", "name": "Rokeya Sultana (Synthetic)", "nid": "SYN-NID-8829108", "phone": "+880-18XX-00108", "addr": "Sector 3, Uttara, Dhaka (Demo)"},
        {"id": "OWN-SYN-109", "name": "Shahidul Alam (Synthetic)", "nid": "SYN-NID-8829109", "phone": "+880-19XX-00109", "addr": "South Avenue, Gulshan-1, Dhaka (Demo)"},
        {"id": "OWN-SYN-110", "name": "Meherun Nesa (Synthetic)", "nid": "SYN-NID-8829110", "phone": "+880-17XX-00110", "addr": "Plot 22, Savar EPZ Road, Dhaka (Demo)"},
        {"id": "OWN-SYN-111", "name": "Kamrul Hassan (Synthetic)", "nid": "SYN-NID-8829111", "phone": "+880-13XX-00111", "addr": "Kazipara Main Road, Mirpur, Dhaka (Demo)"},
        {"id": "OWN-SYN-112", "name": "Dilruba Yasmin (Synthetic)", "nid": "SYN-NID-8829112", "phone": "+880-18XX-00112", "addr": "Khilgaon Chowdhury Para, Dhaka (Demo)"},
        {"id": "OWN-SYN-113", "name": "Ashraful Haque (Synthetic)", "nid": "SYN-NID-8829113", "phone": "+880-16XX-00113", "addr": "Nasirabad Housing, Chattogram (Demo)"},
        {"id": "OWN-SYN-114", "name": "Farhana Parveen (Synthetic)", "nid": "SYN-NID-8829114", "phone": "+880-17XX-00114", "addr": "Zindabazar, Sylhet (Demo)"},
        {"id": "OWN-SYN-115", "name": "Siddiqur Rahman (Synthetic)", "nid": "SYN-NID-8829115", "phone": "+880-19XX-00115", "addr": "Motihar, Rajshahi (Demo)"},
    ]

    owner_map = {}
    for od in owners_data:
        owner = SyntheticOwner(
            owner_id=od["id"],
            full_name=od["name"],
            nid_hash=f"hash-{od['nid']}-demo",
            synthetic_id_label=od["nid"],
            phone_masked=od["phone"],
            address=od["addr"]
        )
        db.session.add(owner)
        owner_map[od["id"]] = owner

    db.session.flush()

    # 2. Define 22 Synthetic Land Records with specific test scenarios
    records_def = [
        # SCENARIO 1: Clean Single Owner, Valid Mutation, Low Risk
        {
            "record_id": "LR-DHK-2024-001",
            "khatian_no": "KH-4101",
            "plot_no": "PL-881",
            "mouza": "Badda (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.12,
            "owner": "OWN-SYN-101",
            "scenario": "CLEAN_SINGLE",
            "txns": [
                {"ref": "TXN-2021-001", "seller": "OWN-SYN-102", "buyer": "OWN-SYN-101", "deed": "DEED-2021-1001", "date": date(2021, 5, 10), "val": 4500000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2021-501", "txn_idx": 0, "applicant": "Mohammad Rafiqul Islam (Synthetic)", "prev": "Fatema Begum (Synthetic)", "khatian": "KH-4101", "app_date": date(2021, 6, 1), "appr_date": date(2021, 8, 15), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Registered Sale Deed (Demo)", "type": "DEED", "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "file": "deed_2021_1001.pdf", "verified": True}
            ]
        },

        # SCENARIO 2: Conflicting Active Sales (DOUBLE-SELLING HIGH RISK!)
        {
            "record_id": "LR-DHK-2024-002",
            "khatian_no": "KH-7720",
            "plot_no": "PL-1044",
            "mouza": "Gulshan (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Commercial",
            "area_acres": 0.25,
            "owner": "OWN-SYN-103",
            "scenario": "DOUBLE_SELLING_ACTIVE",
            "txns": [
                {"ref": "TXN-2020-002", "seller": "OWN-SYN-104", "buyer": "OWN-SYN-103", "deed": "DEED-2020-2002", "date": date(2020, 2, 14), "val": 12000000, "status": "COMPLETED"},
                {"ref": "TXN-2024-091", "seller": "OWN-SYN-103", "buyer": "OWN-SYN-105", "deed": "DEED-2024-8819", "date": date(2024, 3, 1), "val": 18500000, "status": "PENDING_REGISTRATION"},
                {"ref": "TXN-2024-092", "seller": "OWN-SYN-103", "buyer": "OWN-SYN-106", "deed": "DEED-2024-8820", "date": date(2024, 3, 5), "val": 19000000, "status": "PENDING_REGISTRATION"}
            ],
            "mutations": [
                {"case": "MUT-2020-112", "txn_idx": 0, "applicant": "Tanvir Ahmed Chowdhury (Synthetic)", "prev": "Nusrat Jahan (Synthetic)", "khatian": "KH-7720", "app_date": date(2020, 3, 1), "appr_date": date(2020, 5, 20), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Registered Sale Deed (Demo)", "type": "DEED", "hash": "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0", "file": "deed_2020_2002.pdf", "verified": True}
            ]
        },

        # SCENARIO 3: Valid Sequence of 3 Completed Transfers (Clean Multi-Year History)
        {
            "record_id": "LR-DHK-2024-003",
            "khatian_no": "KH-9921",
            "plot_no": "PL-302",
            "mouza": "Uttara-Sector-11 (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.18,
            "owner": "OWN-SYN-107",
            "scenario": "CLEAN_MULTI_STEP",
            "txns": [
                {"ref": "TXN-2015-010", "seller": "OWN-SYN-108", "buyer": "OWN-SYN-109", "deed": "DEED-2015-3001", "date": date(2015, 4, 10), "val": 3500000, "status": "COMPLETED"},
                {"ref": "TXN-2019-020", "seller": "OWN-SYN-109", "buyer": "OWN-SYN-110", "deed": "DEED-2019-3002", "date": date(2019, 7, 18), "val": 6200000, "status": "COMPLETED"},
                {"ref": "TXN-2023-030", "seller": "OWN-SYN-110", "buyer": "OWN-SYN-107", "deed": "DEED-2023-3003", "date": date(2023, 9, 2), "val": 9500000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2015-301", "txn_idx": 0, "applicant": "Shahidul Alam (Synthetic)", "prev": "Rokeya Sultana (Synthetic)", "khatian": "KH-5100", "app_date": date(2015, 5, 1), "appr_date": date(2015, 6, 12), "status": "APPROVED"},
                {"case": "MUT-2019-302", "txn_idx": 1, "applicant": "Meherun Nesa (Synthetic)", "prev": "Shahidul Alam (Synthetic)", "khatian": "KH-7200", "app_date": date(2019, 8, 1), "appr_date": date(2019, 9, 20), "status": "APPROVED"},
                {"case": "MUT-2023-303", "txn_idx": 2, "applicant": "Mahmudur Rahman (Synthetic)", "prev": "Meherun Nesa (Synthetic)", "khatian": "KH-9921", "app_date": date(2023, 9, 15), "appr_date": date(2023, 11, 4), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Latest Registered Deed (Demo)", "type": "DEED", "hash": "b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01", "file": "deed_2023_3003.pdf", "verified": True}
            ]
        },

        # SCENARIO 4: Cancelled Transaction (Must NOT trigger false alarm)
        {
            "record_id": "LR-DHK-2024-004",
            "khatian_no": "KH-3310",
            "plot_no": "PL-511",
            "mouza": "Mirpur-Block-C (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.15,
            "owner": "OWN-SYN-111",
            "scenario": "CANCELLED_TXN_CLEAN",
            "txns": [
                {"ref": "TXN-2021-041", "seller": "OWN-SYN-101", "buyer": "OWN-SYN-111", "deed": "DEED-2021-4001", "date": date(2021, 1, 10), "val": 5000000, "status": "COMPLETED"},
                # Cancelled transaction when negotiation collapsed
                {"ref": "TXN-2023-042", "seller": "OWN-SYN-111", "buyer": "OWN-SYN-106", "deed": "DEED-2023-4002", "date": date(2023, 2, 20), "val": 7000000, "status": "CANCELLED", "notes": "Transaction revoked by mutual agreement before registration."}
            ],
            "mutations": [
                {"case": "MUT-2021-401", "txn_idx": 0, "applicant": "Kamrul Hassan (Synthetic)", "prev": "Mohammad Rafiqul Islam (Synthetic)", "khatian": "KH-3310", "app_date": date(2021, 2, 1), "appr_date": date(2021, 4, 15), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Valid Deed (Demo)", "type": "DEED", "hash": "c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012", "file": "deed_2021_4001.pdf", "verified": True}
            ]
        },

        # SCENARIO 5: Ownership Chain Inconsistency (Seller does not match prior buyer)
        {
            "record_id": "LR-DHK-2024-005",
            "khatian_no": "KH-5820",
            "plot_no": "PL-614",
            "mouza": "Dhanmondi-Plot-B (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.20,
            "owner": "OWN-SYN-112",
            "scenario": "CHAIN_INCONSISTENCY",
            "txns": [
                # First sale: 104 sold to 105
                {"ref": "TXN-2020-051", "seller": "OWN-SYN-104", "buyer": "OWN-SYN-105", "deed": "DEED-2020-5001", "date": date(2020, 6, 12), "val": 8000000, "status": "COMPLETED"},
                # Second sale: but seller is 108 instead of 105! Broken chain!
                {"ref": "TXN-2023-052", "seller": "OWN-SYN-108", "buyer": "OWN-SYN-112", "deed": "DEED-2023-5002", "date": date(2023, 8, 22), "val": 11000000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2020-501", "txn_idx": 0, "applicant": "Kabir Hossain (Synthetic)", "prev": "Nusrat Jahan (Synthetic)", "khatian": "KH-5820", "app_date": date(2020, 7, 1), "appr_date": date(2020, 8, 10), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Questionable Deed (Demo)", "type": "DEED", "hash": "d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123", "file": "deed_2023_5002.pdf", "verified": True}
            ]
        },

        # SCENARIO 6: Mutation Mismatch (Completed sale but missing mutation + Irregular mutation note)
        {
            "record_id": "LR-DHK-2024-006",
            "khatian_no": "KH-6119",
            "plot_no": "PL-729",
            "mouza": "Tejgaon (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Commercial",
            "area_acres": 0.35,
            "owner": "OWN-SYN-113",
            "scenario": "MUTATION_MISMATCH",
            "txns": [
                {"ref": "TXN-2022-061", "seller": "OWN-SYN-102", "buyer": "OWN-SYN-113", "deed": "DEED-2022-6001", "date": date(2022, 1, 15), "val": 15000000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2022-601", "txn_idx": 0, "applicant": "Unknown Third Party (Synthetic)", "prev": "Fatema Begum (Synthetic)", "khatian": "KH-9999", "app_date": date(2022, 2, 10), "appr_date": None, "status": "IRREGULAR", "remarks": "Name discrepancy in Dakhila and missing Porcha submission"}
            ],
            "docs": [
                {"title": "Deed Copy (Demo)", "type": "DEED", "hash": "e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01234", "file": "deed_2022_6001.pdf", "verified": True}
            ]
        },

        # SCENARIO 7: Document Hash Mismatch (Tampered / Compromised Document Reference)
        {
            "record_id": "LR-DHK-2024-007",
            "khatian_no": "KH-8402",
            "plot_no": "PL-912",
            "mouza": "Savar (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Agricultural (Nal)",
            "area_acres": 0.50,
            "owner": "OWN-SYN-114",
            "scenario": "DOC_HASH_MISMATCH",
            "txns": [
                {"ref": "TXN-2023-071", "seller": "OWN-SYN-110", "buyer": "OWN-SYN-114", "deed": "DEED-2023-7001", "date": date(2023, 4, 18), "val": 3200000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2023-701", "txn_idx": 0, "applicant": "Farhana Parveen (Synthetic)", "prev": "Meherun Nesa (Synthetic)", "khatian": "KH-8402", "app_date": date(2023, 5, 2), "appr_date": date(2023, 6, 20), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Registered Deed Document (Demo)", "type": "DEED", "hash": "f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012345", "file": "deed_2023_7001.pdf", "verified": False}
            ]
        },

        # SCENARIO 8: Missing Supporting Information (Missing Deed / Plot details)
        {
            "record_id": "LR-DHK-2024-008",
            "khatian_no": "",  # Missing Khatian!
            "plot_no": "PL-998",
            "mouza": "Badda (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.10,
            "owner": "OWN-SYN-115",
            "scenario": "MISSING_DATA",
            "txns": [
                {"ref": "TXN-2024-081", "seller": "OWN-SYN-103", "buyer": "OWN-SYN-115", "deed": "", "date": date(2024, 1, 10), "val": 2200000, "status": "UNDER_REVIEW"}
            ],
            "mutations": [],
            "docs": []
        },

        # SCENARIO 9: Duplicate Deed Number (Same deed number in two transactions)
        {
            "record_id": "LR-DHK-2024-009",
            "khatian_no": "KH-1928",
            "plot_no": "PL-405",
            "mouza": "Gulshan (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Commercial",
            "area_acres": 0.40,
            "owner": "OWN-SYN-106",
            "scenario": "DUPLICATE_DEED",
            "txns": [
                {"ref": "TXN-2022-091", "seller": "OWN-SYN-107", "buyer": "OWN-SYN-106", "deed": "DEED-DUPLICATE-9999", "date": date(2022, 5, 12), "val": 16000000, "status": "COMPLETED"},
                {"ref": "TXN-2023-092", "seller": "OWN-SYN-106", "buyer": "OWN-SYN-108", "deed": "DEED-DUPLICATE-9999", "date": date(2023, 11, 4), "val": 17500000, "status": "PENDING_REGISTRATION"}
            ],
            "mutations": [
                {"case": "MUT-2022-901", "txn_idx": 0, "applicant": "Salma Akter (Synthetic)", "prev": "Mahmudur Rahman (Synthetic)", "khatian": "KH-1928", "app_date": date(2022, 6, 1), "appr_date": date(2022, 7, 19), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Deed Duplicate Record", "type": "DEED", "hash": "0718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456", "file": "deed_dup.pdf", "verified": True}
            ]
        },

        # SCENARIO 10: Prior Conflicting Transfers (Completed Overlapping Sales)
        {
            "record_id": "LR-DHK-2024-010",
            "khatian_no": "KH-3490",
            "plot_no": "PL-112",
            "mouza": "Uttara-Sector-11 (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.22,
            "owner": "OWN-SYN-102",
            "scenario": "CONFLICTING_COMPLETED_SALES",
            "txns": [
                # Seller 101 sold to 102
                {"ref": "TXN-2021-101", "seller": "OWN-SYN-101", "buyer": "OWN-SYN-102", "deed": "DEED-2021-9901", "date": date(2021, 3, 1), "val": 5500000, "status": "COMPLETED"},
                # Same seller 101 allegedly sold same land to 103 without repurchase!
                {"ref": "TXN-2022-102", "seller": "OWN-SYN-101", "buyer": "OWN-SYN-103", "deed": "DEED-2022-9902", "date": date(2022, 4, 15), "val": 6100000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2021-1001", "txn_idx": 0, "applicant": "Fatema Begum (Synthetic)", "prev": "Mohammad Rafiqul Islam (Synthetic)", "khatian": "KH-3490", "app_date": date(2021, 4, 1), "appr_date": date(2021, 5, 20), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Conflicting Conveyance Deed", "type": "DEED", "hash": "18293a4b5c6d7e8f90123456789abcdef0123456789abcdef01234567", "file": "deed_conflict.pdf", "verified": True}
            ]
        },

        # SCENARIO 11 - 22: Additional realistic records
        {
            "record_id": "LR-CTG-2024-011",
            "khatian_no": "KH-CTG-201",
            "plot_no": "PL-CTG-55",
            "mouza": "Nasirabad (Demo)",
            "district": "Chattogram",
            "division": "Chattogram",
            "land_type": "Commercial",
            "area_acres": 0.30,
            "owner": "OWN-SYN-113",
            "scenario": "CLEAN_COMMERCIAL",
            "txns": [
                {"ref": "TXN-2022-111", "seller": "OWN-SYN-105", "buyer": "OWN-SYN-113", "deed": "DEED-2022-1101", "date": date(2022, 8, 20), "val": 14000000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2022-1101", "txn_idx": 0, "applicant": "Ashraful Haque (Synthetic)", "prev": "Kabir Hossain (Synthetic)", "khatian": "KH-CTG-201", "app_date": date(2022, 9, 10), "appr_date": date(2022, 11, 2), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Chattogram Sub-Registry Deed", "type": "DEED", "hash": "293a4b5c6d7e8f90123456789abcdef0123456789abcdef012345678", "file": "ctg_deed_1101.pdf", "verified": True}
            ]
        },
        {
            "record_id": "LR-SYL-2024-012",
            "khatian_no": "KH-SYL-304",
            "plot_no": "PL-SYL-12",
            "mouza": "Zindabazar (Demo)",
            "district": "Sylhet",
            "division": "Sylhet",
            "land_type": "Residential",
            "area_acres": 0.16,
            "owner": "OWN-SYN-114",
            "scenario": "CLEAN_RESIDENTIAL",
            "txns": [
                {"ref": "TXN-2021-121", "seller": "OWN-SYN-108", "buyer": "OWN-SYN-114", "deed": "DEED-2021-1201", "date": date(2021, 10, 15), "val": 4800000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2021-1201", "txn_idx": 0, "applicant": "Farhana Parveen (Synthetic)", "prev": "Rokeya Sultana (Synthetic)", "khatian": "KH-SYL-304", "app_date": date(2021, 11, 5), "appr_date": date(2022, 1, 12), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Sylhet Sub-Registry Deed", "type": "DEED", "hash": "3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789", "file": "syl_deed_1201.pdf", "verified": True}
            ]
        },
        {
            "record_id": "LR-RAJ-2024-013",
            "khatian_no": "KH-RAJ-109",
            "plot_no": "PL-RAJ-88",
            "mouza": "Motihar (Demo)",
            "district": "Rajshahi",
            "division": "Rajshahi",
            "land_type": "Agricultural (Nal)",
            "area_acres": 0.85,
            "owner": "OWN-SYN-115",
            "scenario": "CLEAN_AGRICULTURAL",
            "txns": [
                {"ref": "TXN-2020-131", "seller": "OWN-SYN-101", "buyer": "OWN-SYN-115", "deed": "DEED-2020-1301", "date": date(2020, 11, 20), "val": 3900000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2020-1301", "txn_idx": 0, "applicant": "Siddiqur Rahman (Synthetic)", "prev": "Mohammad Rafiqul Islam (Synthetic)", "khatian": "KH-RAJ-109", "app_date": date(2020, 12, 1), "appr_date": date(2021, 1, 25), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Agricultural Porcha", "type": "KHATIAN_PORCHA", "hash": "4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789a", "file": "raj_porcha_1301.pdf", "verified": True}
            ]
        },
        {
            "record_id": "LR-DHK-2024-014",
            "khatian_no": "KH-4890",
            "plot_no": "PL-209",
            "mouza": "Mirpur-Block-C (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.14,
            "owner": "OWN-SYN-104",
            "scenario": "CLEAN_HISTORICAL",
            "txns": [
                {"ref": "TXN-2018-141", "seller": "OWN-SYN-102", "buyer": "OWN-SYN-104", "deed": "DEED-2018-1401", "date": date(2018, 3, 10), "val": 4200000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2018-1401", "txn_idx": 0, "applicant": "Nusrat Jahan (Synthetic)", "prev": "Fatema Begum (Synthetic)", "khatian": "KH-4890", "app_date": date(2018, 4, 1), "appr_date": date(2018, 5, 29), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Porcha Copy", "type": "KHATIAN_PORCHA", "hash": "5c6d7e8f90123456789abcdef0123456789abcdef0123456789ab", "file": "porcha_1401.pdf", "verified": True}
            ]
        },
        {
            "record_id": "LR-DHK-2024-015",
            "khatian_no": "KH-9021",
            "plot_no": "PL-634",
            "mouza": "Dhanmondi-Plot-B (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.19,
            "owner": "OWN-SYN-108",
            "scenario": "CLEAN_RECENT",
            "txns": [
                {"ref": "TXN-2023-151", "seller": "OWN-SYN-103", "buyer": "OWN-SYN-108", "deed": "DEED-2023-1501", "date": date(2023, 1, 10), "val": 8500000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2023-1501", "txn_idx": 0, "applicant": "Rokeya Sultana (Synthetic)", "prev": "Tanvir Ahmed Chowdhury (Synthetic)", "khatian": "KH-9021", "app_date": date(2023, 2, 5), "appr_date": date(2023, 3, 15), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Dhanmondi Deed Record", "type": "DEED", "hash": "6d7e8f90123456789abcdef0123456789abcdef0123456789abc", "file": "deed_1501.pdf", "verified": True}
            ]
        },
        {
            "record_id": "LR-DHK-2024-016",
            "khatian_no": "KH-1188",
            "plot_no": "PL-471",
            "mouza": "Savar (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Commercial",
            "area_acres": 0.45,
            "owner": "OWN-SYN-109",
            "scenario": "MEDIUM_MISSING_MUTATION",
            "txns": [
                {"ref": "TXN-2021-161", "seller": "OWN-SYN-107", "buyer": "OWN-SYN-109", "deed": "DEED-2021-1601", "date": date(2021, 9, 14), "val": 7100000, "status": "COMPLETED"}
            ],
            "mutations": [],  # Completely missing mutation after 2021 sale!
            "docs": [
                {"title": "Savar Commercial Deed", "type": "DEED", "hash": "7e8f90123456789abcdef0123456789abcdef0123456789abcd", "file": "deed_1601.pdf", "verified": True}
            ]
        },
        {
            "record_id": "LR-DHK-2024-017",
            "khatian_no": "KH-7312",
            "plot_no": "PL-819",
            "mouza": "Badda (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.11,
            "owner": "OWN-SYN-110",
            "scenario": "CLEAN_RESIDENTIAL",
            "txns": [
                {"ref": "TXN-2022-171", "seller": "OWN-SYN-106", "buyer": "OWN-SYN-110", "deed": "DEED-2022-1701", "date": date(2022, 11, 10), "val": 3800000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2022-1701", "txn_idx": 0, "applicant": "Meherun Nesa (Synthetic)", "prev": "Salma Akter (Synthetic)", "khatian": "KH-7312", "app_date": date(2022, 12, 1), "appr_date": date(2023, 1, 18), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Badda Sale Deed", "type": "DEED", "hash": "8f90123456789abcdef0123456789abcdef0123456789abcde", "file": "deed_1701.pdf", "verified": True}
            ]
        },
        {
            "record_id": "LR-DHK-2024-018",
            "khatian_no": "KH-5561",
            "plot_no": "PL-329",
            "mouza": "Uttara-Sector-11 (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.13,
            "owner": "OWN-SYN-105",
            "scenario": "CLEAN_RESIDENTIAL",
            "txns": [
                {"ref": "TXN-2023-181", "seller": "OWN-SYN-101", "buyer": "OWN-SYN-105", "deed": "DEED-2023-1801", "date": date(2023, 7, 19), "val": 6400000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2023-1801", "txn_idx": 0, "applicant": "Kabir Hossain (Synthetic)", "prev": "Mohammad Rafiqul Islam (Synthetic)", "khatian": "KH-5561", "app_date": date(2023, 8, 1), "appr_date": date(2023, 9, 10), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Uttara Porcha", "type": "KHATIAN_PORCHA", "hash": "90123456789abcdef0123456789abcdef0123456789abcdef0", "file": "porcha_1801.pdf", "verified": True}
            ]
        },
        {
            "record_id": "LR-DHK-2024-019",
            "khatian_no": "KH-6622",
            "plot_no": "PL-145",
            "mouza": "Tejgaon (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Commercial",
            "area_acres": 0.60,
            "owner": "OWN-SYN-102",
            "scenario": "CLEAN_COMMERCIAL",
            "txns": [
                {"ref": "TXN-2020-191", "seller": "OWN-SYN-104", "buyer": "OWN-SYN-102", "deed": "DEED-2020-1901", "date": date(2020, 5, 20), "val": 22000000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2020-1901", "txn_idx": 0, "applicant": "Fatema Begum (Synthetic)", "prev": "Nusrat Jahan (Synthetic)", "khatian": "KH-6622", "app_date": date(2020, 6, 15), "appr_date": date(2020, 8, 1), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Commercial Deed Register", "type": "DEED", "hash": "a123456789abcdef0123456789abcdef0123456789abcdef01", "file": "deed_1901.pdf", "verified": True}
            ]
        },
        {
            "record_id": "LR-DHK-2024-020",
            "khatian_no": "KH-9844",
            "plot_no": "PL-870",
            "mouza": "Gulshan (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Commercial",
            "area_acres": 0.38,
            "owner": "OWN-SYN-107",
            "scenario": "CLEAN_GULSHAN",
            "txns": [
                {"ref": "TXN-2022-201", "seller": "OWN-SYN-109", "buyer": "OWN-SYN-107", "deed": "DEED-2022-2001", "date": date(2022, 10, 10), "val": 25000000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2022-2001", "txn_idx": 0, "applicant": "Mahmudur Rahman (Synthetic)", "prev": "Shahidul Alam (Synthetic)", "khatian": "KH-9844", "app_date": date(2022, 11, 2), "appr_date": date(2022, 12, 19), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Gulshan Title Deed", "type": "DEED", "hash": "b23456789abcdef0123456789abcdef0123456789abcdef012", "file": "deed_2001.pdf", "verified": True}
            ]
        },
        {
            "record_id": "LR-DHK-2024-021",
            "khatian_no": "KH-3140",
            "plot_no": "PL-562",
            "mouza": "Mirpur-Block-C (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.17,
            "owner": "OWN-SYN-111",
            "scenario": "CLEAN_MIRPUR",
            "txns": [
                {"ref": "TXN-2021-211", "seller": "OWN-SYN-110", "buyer": "OWN-SYN-111", "deed": "DEED-2021-2101", "date": date(2021, 4, 18), "val": 5200000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2021-2101", "txn_idx": 0, "applicant": "Kamrul Hassan (Synthetic)", "prev": "Meherun Nesa (Synthetic)", "khatian": "KH-3140", "app_date": date(2021, 5, 10), "appr_date": date(2021, 6, 28), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Mirpur Porcha", "type": "KHATIAN_PORCHA", "hash": "c3456789abcdef0123456789abcdef0123456789abcdef0123", "file": "porcha_2101.pdf", "verified": True}
            ]
        },
        {
            "record_id": "LR-DHK-2024-022",
            "khatian_no": "KH-8877",
            "plot_no": "PL-399",
            "mouza": "Badda (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.14,
            "owner": "OWN-SYN-112",
            "scenario": "CLEAN_BADDA",
            "txns": [
                {"ref": "TXN-2023-221", "seller": "OWN-SYN-106", "buyer": "OWN-SYN-112", "deed": "DEED-2023-2201", "date": date(2023, 3, 14), "val": 4600000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2023-2201", "txn_idx": 0, "applicant": "Dilruba Yasmin (Synthetic)", "prev": "Salma Akter (Synthetic)", "khatian": "KH-8877", "app_date": date(2023, 4, 1), "appr_date": date(2023, 5, 20), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Registered Deed", "type": "DEED", "hash": "d456789abcdef0123456789abcdef0123456789abcdef01234", "file": "deed_2201.pdf", "verified": True}
            ]
        },

        # SCENARIOS FROM REFERENCE UI:
        # P-2048: Joypara, Dhamrai, Dhaka (High Risk Double-Selling & Mutation Inconsistency)
        {
            "record_id": "P-2048",
            "khatian_no": "786",
            "plot_no": "125",
            "mouza": "Joypara, Dhamrai",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.085, # 8.5 Decimal
            "owner": "OWN-SYN-101",
            "scenario": "DOUBLE_SELLING_P2048",
            "txns": [
                {"ref": "TXN-2022-4587", "seller": "OWN-SYN-102", "buyer": "OWN-SYN-101", "deed": "D-101", "date": date(2022, 1, 12), "val": 4800000, "status": "COMPLETED", "notes": "Sold to Rahim Uddin"},
                {"ref": "TXN-2023-1120", "seller": "OWN-SYN-102", "buyer": "OWN-SYN-103", "deed": "D-205", "date": date(2023, 3, 4), "val": 5200000, "status": "PENDING_REGISTRATION", "notes": "Sold to Karim Ahmed (Conflicting Sale)"}
            ],
            "mutations": [
                {"case": "MUT-2023-441", "txn_idx": 0, "applicant": "Tanvir Ahmed Chowdhury (Synthetic)", "prev": "Fatema Begum (Synthetic)", "khatian": "786", "app_date": date(2023, 2, 20), "status": "IRREGULAR", "remarks": "Shows different owner. Inconsistency found with latest registered deed."}
            ],
            "docs": [
                {"title": "Certified Sale Deed D-101 (Demo)", "type": "DEED", "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "file": "deed_d101.pdf", "verified": True},
                {"title": "Khatian Porcha 786", "type": "KHATIAN_PORCHA", "hash": "f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afb", "file": "khatian_786.pdf", "verified": False}
            ]
        },

        # P-3301: Dhamrai, Dhaka (Active Clean Record)
        {
            "record_id": "P-3301",
            "khatian_no": "1024",
            "plot_no": "210",
            "mouza": "Dhamrai (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Agricultural",
            "area_acres": 0.123, # 12.3 Decimal
            "owner": "OWN-SYN-103",
            "scenario": "CLEAN_P3301",
            "txns": [
                {"ref": "TXN-2021-3301", "seller": "OWN-SYN-104", "buyer": "OWN-SYN-103", "deed": "DEED-3301", "date": date(2021, 8, 14), "val": 6100000, "status": "COMPLETED"}
            ],
            "mutations": [
                {"case": "MUT-2021-889", "txn_idx": 0, "applicant": "Tanvir Ahmed Chowdhury (Synthetic)", "prev": "Nusrat Jahan (Synthetic)", "khatian": "1024", "app_date": date(2021, 9, 2), "status": "APPROVED"}
            ],
            "docs": [
                {"title": "Sale Deed 3301", "type": "DEED", "hash": "c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01234", "file": "deed_3301.pdf", "verified": True}
            ]
        },

        # P-1120: Savar, Dhaka (Disputed / Unknown Owner)
        {
            "record_id": "P-1120",
            "khatian_no": "450",
            "plot_no": "98",
            "mouza": "Savar (Demo)",
            "district": "Dhaka",
            "division": "Dhaka",
            "land_type": "Residential",
            "area_acres": 0.060, # 6.0 Decimal
            "owner": None,
            "scenario": "DISPUTED_P1120",
            "txns": [
                {"ref": "TXN-2023-1120-A", "seller": "OWN-SYN-105", "buyer": "OWN-SYN-106", "deed": "DEED-1120", "date": date(2023, 10, 5), "val": 3400000, "status": "UNDER_REVIEW"}
            ],
            "mutations": [],
            "docs": []
        }
    ]

    for r_def in records_def:
        owner_obj = owner_map.get(r_def["owner"])
        record = LandRecord(
            record_id=r_def["record_id"],
            khatian_no=r_def["khatian_no"],
            plot_no=r_def["plot_no"],
            mouza=r_def["mouza"],
            district=r_def["district"],
            division=r_def["division"],
            land_type=r_def["land_type"],
            area_acres=r_def["area_acres"],
            recorded_owner_id=owner_obj.id if owner_obj else None,
            record_status="Active"
        )
        db.session.add(record)
        db.session.flush()

        created_txns = []
        for t_def in r_def.get("txns", []):
            seller_obj = owner_map.get(t_def.get("seller"))
            buyer_obj = owner_map.get(t_def.get("buyer"))
            txn = OwnershipTransaction(
                transaction_ref=t_def["ref"],
                land_record_id=record.id,
                seller_id=seller_obj.id if seller_obj else None,
                buyer_id=buyer_obj.id if buyer_obj else None,
                deed_number=t_def.get("deed", ""),
                deed_date=t_def["date"],
                transaction_value_bdt=t_def["val"],
                status=t_def.get("status", "COMPLETED"),
                registration_office=f"Sub-Registry Office {record.district} (Demo)",
                notes=t_def.get("notes")
            )
            db.session.add(txn)
            created_txns.append(txn)

        db.session.flush()

        for m_def in r_def.get("mutations", []):
            matched_txn = None
            if "txn_idx" in m_def and m_def["txn_idx"] < len(created_txns):
                matched_txn = created_txns[m_def["txn_idx"]]

            mut = MutationHistory(
                mutation_case_no=m_def["case"],
                land_record_id=record.id,
                transaction_id=matched_txn.id if matched_txn else None,
                applicant_name=m_def["applicant"],
                previous_owner_name=m_def["prev"],
                new_khatian_no=m_def.get("khatian"),
                application_date=m_def["app_date"],
                approval_date=m_def.get("appr_date"),
                status=m_def.get("status", "APPROVED"),
                ac_land_office=f"AC Land Office {record.mouza}",
                remarks=m_def.get("remarks")
            )
            db.session.add(mut)

        for d_def in r_def.get("docs", []):
            doc = DocumentReference(
                land_record_id=record.id,
                doc_type=d_def["type"],
                doc_title=d_def["title"],
                reference_hash=d_def["hash"],
                file_name=d_def["file"],
                verified_hash=d_def["verified"]
            )
            db.session.add(doc)

    db.session.commit()

    # Now run screening on all seed records to generate realistic baseline reports and alerts
    all_records = LandRecord.query.all()
    for rec in all_records:
        run_land_record_verification(rec.record_id)

    print(f"Successfully seeded {len(all_records)} synthetic land records and initialized alerts.")

if __name__ == "__main__":
    from app import create_app
    app = create_app()
    with app.app_context():
        seed_database()
