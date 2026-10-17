import pytest
import io
from datetime import date
from dataclasses import dataclass
from typing import List, Optional

from app.services.rules_engine import FraudDetectionEngine
from app.services.document_service import verify_document_integrity

# Mock classes to test rules engine in isolation without database dependency
@dataclass
class MockOwner:
    id: int
    full_name: str

@dataclass
class MockTransaction:
    id: int
    transaction_ref: str
    seller_id: Optional[int]
    buyer_id: int
    deed_number: str
    deed_date: date
    status: str
    seller: Optional[MockOwner] = None
    buyer: Optional[MockOwner] = None

@dataclass
class MockMutation:
    id: int
    mutation_case_no: str
    transaction_id: Optional[int]
    applicant_name: str
    previous_owner_name: str
    status: str
    remarks: Optional[str] = None
    application_date: Optional[date] = None
    approval_date: Optional[date] = None

@dataclass
class MockDocument:
    id: int
    doc_title: str
    doc_type: str
    reference_hash: str
    file_name: str
    verified_hash: bool

@dataclass
class MockLandRecord:
    id: int
    record_id: str
    khatian_no: str
    plot_no: str
    mouza: str
    district: str
    recorded_owner_id: int
    recorded_owner: MockOwner
    transactions: List[MockTransaction]
    mutations: List[MockMutation]
    documents: List[MockDocument]


class TestFraudDetectionEngine:
    def setup_method(self):
        self.engine = FraudDetectionEngine()
        self.owner_a = MockOwner(1, "Rahim (Synthetic)")
        self.owner_b = MockOwner(2, "Karim (Synthetic)")
        self.owner_c = MockOwner(3, "Jabbar (Synthetic)")

    def test_normal_historical_sequence_no_false_alarm(self):
        """1. A legitimate historical sequence of transfers must not trigger a false double-selling alert."""
        t1 = MockTransaction(1, "TX-1", 1, 2, "DEED-1", date(2020, 1, 1), "COMPLETED", self.owner_a, self.owner_b)
        t2 = MockTransaction(2, "TX-2", 2, 3, "DEED-2", date(2022, 1, 1), "COMPLETED", self.owner_b, self.owner_c)
        m1 = MockMutation(1, "MUT-1", 1, "Karim (Synthetic)", "Rahim (Synthetic)", "APPROVED", None, date(2020, 2, 1), date(2020, 4, 1))
        m2 = MockMutation(2, "MUT-2", 2, "Jabbar (Synthetic)", "Karim (Synthetic)", "APPROVED", None, date(2022, 2, 1), date(2022, 4, 1))
        d1 = MockDocument(1, "Deed Porcha", "DEED", "hash123", "deed.pdf", True)

        record = MockLandRecord(
            id=101, record_id="LR-TEST-001", khatian_no="KH-101", plot_no="PL-101",
            mouza="Badda", district="Dhaka", recorded_owner_id=3, recorded_owner=self.owner_c,
            transactions=[t1, t2], mutations=[m1, m2], documents=[d1]
        )

        res = self.engine.evaluate(record)
        assert "CONFLICTING_ACTIVE_SALES" not in res.triggered_rules
        assert "CONFLICTING_OWNERSHIP_TRANSFERS" not in res.triggered_rules
        assert res.risk_score < 20
        assert res.risk_band == "LOW"

    def test_conflicting_active_sales_detected(self):
        """2. Conflicting active sales for the same parcel are detected (Double-Selling)."""
        t_active1 = MockTransaction(1, "TX-1", 1, 2, "DEED-1", date(2024, 3, 1), "PENDING_REGISTRATION", self.owner_a, self.owner_b)
        t_active2 = MockTransaction(2, "TX-2", 1, 3, "DEED-2", date(2024, 3, 5), "PENDING_REGISTRATION", self.owner_a, self.owner_c)

        record = MockLandRecord(
            id=102, record_id="LR-TEST-002", khatian_no="KH-102", plot_no="PL-102",
            mouza="Gulshan", district="Dhaka", recorded_owner_id=1, recorded_owner=self.owner_a,
            transactions=[t_active1, t_active2], mutations=[], documents=[]
        )

        res = self.engine.evaluate(record)
        assert "CONFLICTING_ACTIVE_SALES" in res.triggered_rules
        assert res.risk_score >= 40

    def test_cancelled_transaction_does_not_trigger_false_double_selling(self):
        """3. A cancelled transaction does not incorrectly trigger a double-selling alert."""
        t_comp = MockTransaction(1, "TX-1", 1, 2, "DEED-1", date(2021, 1, 1), "COMPLETED", self.owner_a, self.owner_b)
        t_canc = MockTransaction(2, "TX-2", 2, 3, "DEED-2", date(2023, 2, 1), "CANCELLED", self.owner_b, self.owner_c)
        m1 = MockMutation(1, "MUT-1", 1, "Karim (Synthetic)", "Rahim (Synthetic)", "APPROVED", None, date(2021, 2, 1), date(2021, 3, 1))

        record = MockLandRecord(
            id=103, record_id="LR-TEST-003", khatian_no="KH-103", plot_no="PL-103",
            mouza="Mirpur", district="Dhaka", recorded_owner_id=2, recorded_owner=self.owner_b,
            transactions=[t_comp, t_canc], mutations=[m1], documents=[]
        )

        res = self.engine.evaluate(record)
        assert "CONFLICTING_ACTIVE_SALES" not in res.triggered_rules

    def test_ownership_chain_inconsistency_detected(self):
        """4. An ownership chain inconsistency (gap/mismatch) is detected."""
        # t1: owner_a sold to owner_b
        t1 = MockTransaction(1, "TX-1", 1, 2, "DEED-1", date(2020, 1, 1), "COMPLETED", self.owner_a, self.owner_b)
        # t2: but seller is owner_c instead of owner_b!
        t2 = MockTransaction(2, "TX-2", 3, 1, "DEED-2", date(2022, 1, 1), "COMPLETED", self.owner_c, self.owner_a)

        record = MockLandRecord(
            id=104, record_id="LR-TEST-004", khatian_no="KH-104", plot_no="PL-104",
            mouza="Dhanmondi", district="Dhaka", recorded_owner_id=1, recorded_owner=self.owner_a,
            transactions=[t1, t2], mutations=[], documents=[]
        )

        res = self.engine.evaluate(record)
        assert "OWNERSHIP_CHAIN_INCONSISTENCY" in res.triggered_rules
        assert res.risk_score >= 20

    def test_mutation_mismatch_detected(self):
        """5. A mutation irregularity or mismatch is detected."""
        t1 = MockTransaction(1, "TX-1", 1, 2, "DEED-1", date(2020, 1, 1), "COMPLETED", self.owner_a, self.owner_b)
        m_irreg = MockMutation(1, "MUT-1", 1, "Unknown Entity", "Rahim", "IRREGULAR", "Forged signature suspected", date(2020, 2, 1), None)

        record = MockLandRecord(
            id=105, record_id="LR-TEST-005", khatian_no="KH-105", plot_no="PL-105",
            mouza="Tejgaon", district="Dhaka", recorded_owner_id=2, recorded_owner=self.owner_b,
            transactions=[t1], mutations=[m_irreg], documents=[]
        )

        res = self.engine.evaluate(record)
        assert "MUTATION_MISMATCH" in res.triggered_rules
        assert res.risk_score >= 15

    def test_document_hash_match_and_mismatch(self):
        """6. A document hash match and mismatch produce different results."""
        content = b"Synthetic Sample Land Deed File Content"
        import hashlib
        correct_hash = hashlib.sha256(content).hexdigest()
        wrong_hash = "0000000000000000000000000000000000000000000000000000000000000000"

        class DummyUpload:
            def __init__(self, data, name="deed.pdf"):
                self.stream = io.BytesIO(data)
                self.filename = name

        # Test match
        res_match = verify_document_integrity(DummyUpload(content), correct_hash)
        assert res_match["success"] is True
        assert res_match["is_match"] is True

        # Test mismatch
        res_mismatch = verify_document_integrity(DummyUpload(content), wrong_hash)
        assert res_mismatch["success"] is True
        assert res_mismatch["is_match"] is False

    def test_risk_score_capped_at_100(self):
        """7. Risk score must not exceed 100 even if all high-penalty rules fire."""
        # Create a record triggering multiple rules
        t_active1 = MockTransaction(1, "TX-1", 1, 2, "DEED-1", date(2024, 3, 1), "PENDING_REGISTRATION", self.owner_a, self.owner_b)
        t_active2 = MockTransaction(2, "TX-2", 1, 3, "DEED-1", date(2024, 3, 5), "PENDING_REGISTRATION", self.owner_a, self.owner_c)
        m_irreg = MockMutation(1, "MUT-1", 1, "Unknown", "Rahim", "IRREGULAR", "Audit issue", date(2024, 3, 2), None)
        d_bad = MockDocument(1, "Tampered Deed", "DEED", "hash999", "deed.pdf", False)

        record = MockLandRecord(
            id=106, record_id="LR-TEST-006", khatian_no="", plot_no="",
            mouza="Savar", district="Dhaka", recorded_owner_id=None, recorded_owner=None,
            transactions=[t_active1, t_active2], mutations=[m_irreg], documents=[d_bad]
        )

        res = self.engine.evaluate(record)
        assert res.risk_score <= 100
        assert res.risk_score >= 80

    def test_duplicate_issues_do_not_retrigger_same_rule(self):
        """8. Duplicate issues of the same type do not unnecessarily inflate the score."""
        # Multiple missing fields should only trigger MISSING_SUPPORTING_DATA once
        record = MockLandRecord(
            id=107, record_id="LR-TEST-007", khatian_no="", plot_no="",
            mouza="Badda", district="Dhaka", recorded_owner_id=None, recorded_owner=None,
            transactions=[], mutations=[], documents=[]
        )

        res = self.engine.evaluate(record)
        rule_occurrences = [f for f in res.findings if f.rule_code == "MISSING_SUPPORTING_DATA"]
        assert len(rule_occurrences) == 1
