# LandGuard — Integrated Digital Land Verification & Fraud Detection Platform

> **Track:** Digital Land Records, Verification & Digitization  
> **Problem Statement:** P3 — Fraud & Double-Selling Detection  
> **Type:** Hackathon Demonstration Prototype  
> **Notice:** Uses synthetic demonstration records only. Does not connect to live government databases.

---

## 1. Project Overview & Context

**LandGuard** is an automated screening and integrity analysis platform designed to combat land fraud, double-selling schemes, and deed inconsistencies. In traditional land record ecosystems, the separation between Sub-Registry Offices (deed conveyance) and Assistant Commissioner (Land) Offices (mutation/Namzari) often creates information latency where a single land parcel is fraudulently pledged, sold to multiple buyers simultaneously, or transferred through broken title chains.

LandGuard addresses this by providing an explainable, rule-based screening engine that cross-references:
1. **Active and historical deed conveyance transactions** (Sub-Registry records)
2. **AC Land mutation proceedings** (Namzari cases, Khatian allocations)
3. **Cryptographic document checksums** (SHA-256 byte-level verification)
4. **Ownership chain continuity** (Baya deed progression)

---

## 2. Important Synthetic Data & Legal Disclaimer

> **STATUTORY DEMONSTRATION DISCLAIMER**  
> LandGuard is an experimental prototype designed exclusively with **synthetic demonstration data**.  
> - It **never** connects to or scrapes live government land registry systems.  
> - It contains **no records of real citizens**, actual NIDs, or real properties.  
> - Screening results and risk scores **do not establish legal ownership**, certify authentic deeds, or prove that a person committed fraud.  
> - A low score is **never proof** that a transaction is safe or free from encumbrances.

---

## 3. Core Features

- **Double-Selling Detection Engine:** Flags parcels with concurrent active/pending sale registrations (`+40` pts) or overlapping completed transfers (`+30` pts) without legitimate reconveyance.
- **Ownership-Chain Continuity Check:** Verifies that every transaction's seller matches the legitimate prior buyer in chronological sequence (`+20` pts).
- **Namzari / Mutation Mismatch Detection:** Flags unmutated completed transfers older than 180 days, irregular auditor remarks, or conflicts between recorded owners and mutation applicants (`+15` pts).
- **Cryptographic Document Integrity Verification:** Validates uploaded deeds/porchas in-memory against stored reference SHA-256 hashes (`+20` pts).
- **Explainable Fraud-Risk Scoring:** Transparent, rule-based points system (0–100 capped) categorized into **Low (0–19)**, **Medium (20–49)**, and **High (50–100)** risk bands with evidence payloads and suggested next actions.
- **Interactive Land Search:** Multi-attribute database queries supporting partial matching across Record ID, Khatian number, Plot number, Mouza, District, and Synthetic Owner.
- **Saved Verification Reports & Print-to-PDF:** Generates structured audit dossiers persisted in SQLite/MySQL that can be reopened and printed.
- **Fraud Alerts Management:** Review, filter, annotate, and update status (`OPEN`, `REVIEWED`, `UNRESOLVED`) for detected anomalies.

---

## 4. Technology Stack

### Frontend:
- **React 19 & TypeScript:** Strict type-safe UI components.
- **Vite:** Rapid development server with backend API proxy.
- **Tailwind CSS:** Modern land-tech design system with dark navy blue primary (`#0A192F`), teal accents (`#0D9488`), and distinct risk states.
- **Lucide React:** Iconography suite.
- **Recharts:** Responsive risk distribution pie charts and monthly screening telemetry bar charts.
- **React Router DOM v7:** Client-side routing and tab navigation.

### Backend:
- **Python 3.14 / 3.10+ & Flask:** RESTful service architecture.
- **Flask-CORS:** Cross-origin resource sharing configuration.
- **SQLAlchemy ORM:** Relational data mapping.
- **SQLite (Default) & MySQL (Production-Ready):** Clean database abstraction.
- **Python Rules Engine:** Modular, decoupled risk detection service (`app/services/rules_engine.py`).
- **Pytest:** Comprehensive automated test suite.

---

## 5. System Architecture & Folder Structure

```
LandGuard/
├── backend/
│   ├── app/
│   │   ├── __init__.py               # Flask app factory, CORS & blueprint registration
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── models.py             # Relational models: LandRecord, SyntheticOwner, etc.
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── dashboard.py          # GET /api/dashboard/stats
│   │   │   ├── land_records.py       # GET /api/land-records, /search, /<id>
│   │   │   ├── verification.py       # POST /api/verify/<id>, GET /reports
│   │   │   ├── fraud_alerts.py       # GET, PATCH /api/fraud-alerts/<id>
│   │   │   └── documents.py          # POST /api/documents/verify-hash
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── rules_engine.py       # Core double-selling and scoring rules
│   │   │   ├── verification_service.py # Audit coordination and persistence
│   │   │   └── document_service.py   # In-memory SHA-256 calculation
│   │   └── seed_data.py              # Seeds 22 synthetic test scenarios
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_rules_engine.py      # Pytest automated test cases
│   ├── config.py                     # Configuration settings
│   ├── run.py                        # Entrypoint with auto-seeding
│   ├── requirements.txt              # Backend dependencies
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Sidebar, DisclaimerBanner, RiskBadge, etc.
│   │   ├── pages/                    # Dashboard, LandRecords, RecordDetails, VerifyLand, etc.
│   │   ├── services/
│   │   │   └── api.ts                # Centralized typed fetch client
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript interfaces
│   │   ├── App.tsx                   # Main router
│   │   ├── main.tsx
│   │   └── index.css                 # Tailwind directives
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts                # Vite dev server with /api proxy
│   └── .env.example
├── README.md
└── .gitignore
```

---

## 6. Installation & Quick Start

### Prerequisites
- **Python 3.10+** (Tested on Python 3.14)
- **Node.js 18+** & **npm 9+** (Tested on Node v24)

---

### Step 1: Backend Setup

1. Open a terminal and navigate to the project root:
   ```bash
   cd c:/Users/hp/Desktop/LandGuard
   ```

2. Create and activate a Python virtual environment:
   ```powershell
   # Windows PowerShell
   python -m venv backend/venv
   .\backend\venv\Scripts\Activate.ps1
   ```

3. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. Initialize and seed the synthetic database:
   ```bash
   python backend/app/seed_data.py
   ```
   *Seeds 22 fictional land records covering all clean, double-selling, chain-gap, and mutation scenarios.*

5. Start the Flask Backend Server:
   ```bash
   python backend/run.py
   ```
   *The API will start on `http://127.0.0.1:5000`.*

---

### Step 2: Frontend Setup

1. Open a second terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend dashboard will be available at `http://localhost:5173`.*

---

## 7. Running Automated Tests

Run the backend unit test suite using `pytest`:

```powershell
.\backend\venv\Scripts\pytest -v .\backend\tests
```

### Verified Test Cases:
- `test_normal_historical_sequence_no_false_alarm`: Confirms legitimate sequences of completed transfers do not trigger double-selling false positives.
- `test_conflicting_active_sales_detected`: Detects multiple pending sale registrations on the same parcel.
- `test_cancelled_transaction_does_not_trigger_false_double_selling`: Asserts that cancelled deals are ignored.
- `test_ownership_chain_inconsistency_detected`: Flags transactions where the seller is not the previous buyer.
- `test_mutation_mismatch_detected`: Flags irregular Namzari remarks or missing mutation cases.
- `test_document_hash_match_and_mismatch`: Validates cryptographic byte comparison.
- `test_risk_score_capped_at_100`: Ensures risk score never exceeds 100.
- `test_duplicate_issues_do_not_retrigger_same_rule`: Confirms score inflation deduplication.

---

## 8. REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and prototype mode status |
| `GET` | `/api/dashboard/stats` | Aggregated metrics, charts, and recent activity |
| `GET` | `/api/land-records` | Paginated listing of synthetic land records |
| `GET` | `/api/land-records/search?q={query}` | Search by Plot, Khatian, Mouza, District, or Owner |
| `GET` | `/api/land-records/<record_id>` | Detailed record with transactions, mutations, documents |
| `POST` | `/api/verify/<record_id>` | Executes rules engine, generates and stores verification report |
| `GET` | `/api/verification-reports` | Lists historical verification reports |
| `GET` | `/api/verification-reports/<report_id>` | Detailed screening report dossier |
| `GET` | `/api/fraud-alerts` | Filter alerts by risk band, type, status, or record ID |
| `PATCH`| `/api/fraud-alerts/<alert_id>` | Update alert status (`REVIEWED`, `UNRESOLVED`) and reviewer notes |
| `POST` | `/api/documents/verify-hash` | In-memory SHA-256 hash comparison of uploaded document |
| `GET` | `/api/documents/references` | Returns stored demo document references for quick testing |

---

## 9. Switching from SQLite to MySQL

LandGuard uses SQLAlchemy ORM and standard ANSI SQL conventions. To migrate from SQLite to MySQL:

1. Install PyMySQL in your virtual environment:
   ```bash
   pip install pymysql cryptography
   ```
2. Update `DATABASE_URL` in `backend/.env` (or environment variables):
   ```ini
   DATABASE_URL=mysql+pymysql://<user>:<password>@localhost:3306/<dbname>
   ```
3. Re-run `python backend/app/seed_data.py` to initialize tables and synthetic demo data in MySQL.

---

## 10. AI Coding Assistant Disclosure

This project was developed with the assistance of advanced AI coding agents (Google DeepMind Antigravity / Gemini) for rapid architectural scaffolding, component drafting, and synthetic test dataset generation. All software architecture, algorithmic logic, validation rules, and security controls have been validated, tested, and reviewed by the development team.
