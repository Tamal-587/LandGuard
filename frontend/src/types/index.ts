export interface SyntheticOwner {
  id: number;
  owner_id: string;
  full_name: string;
  nid_hash: string;
  synthetic_id_label: string;
  phone_masked: string;
  address: string;
  created_at: string;
}

export interface OwnershipTransaction {
  id: number;
  transaction_ref: string;
  land_record_id: number;
  seller_id?: number | null;
  seller?: SyntheticOwner | null;
  buyer_id: number;
  buyer?: SyntheticOwner | null;
  deed_number: string;
  deed_date: string;
  transaction_value_bdt: number;
  status: 'COMPLETED' | 'PENDING_REGISTRATION' | 'CANCELLED' | 'UNDER_REVIEW';
  registration_office: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MutationHistory {
  id: number;
  mutation_case_no: string;
  land_record_id: number;
  transaction_id?: number | null;
  transaction?: OwnershipTransaction | null;
  applicant_name: string;
  previous_owner_name: string;
  new_khatian_no?: string | null;
  application_date: string;
  approval_date?: string | null;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'IRREGULAR';
  ac_land_office: string;
  remarks?: string | null;
  created_at: string;
}

export interface DocumentReference {
  id: number;
  land_record_id: number;
  doc_type: string;
  doc_title: string;
  reference_hash: string;
  file_name: string;
  file_size_bytes: number;
  upload_date: string;
  verified_hash: boolean;
  created_at: string;
}

export interface FraudAlert {
  id: number;
  alert_ref: string;
  land_record_id: number;
  land_record_identifier?: string;
  plot_no?: string;
  mouza?: string;
  alert_type: string;
  risk_band: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_score: number;
  title: string;
  description: string;
  evidence_json: string;
  status: 'OPEN' | 'REVIEWED' | 'UNRESOLVED';
  detected_at: string;
  reviewed_at?: string | null;
  reviewer_notes?: string | null;
}

export interface Finding {
  rule_code: string;
  rule_name: string;
  points: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  explanation: string;
  evidence: Record<string, any>;
  suggested_action: string;
}

export interface CheckPerformed {
  check_id: string;
  name: string;
  description: string;
}

export interface ScreeningResult {
  land_record_id: number;
  record_identifier: string;
  risk_score: number;
  risk_band: 'LOW' | 'MEDIUM' | 'HIGH';
  screening_status: string;
  checks_performed: CheckPerformed[];
  findings: Finding[];
  triggered_rules: string[];
  recommended_next_steps: string;
  disclaimer: string;
}

export interface VerificationReport {
  id: number;
  report_ref: string;
  land_record_id: number;
  land_record_identifier?: string;
  khatian_no?: string;
  plot_no?: string;
  mouza?: string;
  screening_status: string;
  risk_score: number;
  risk_band: 'LOW' | 'MEDIUM' | 'HIGH';
  checks_performed_json: string;
  findings_json: string;
  triggered_rules_json: string;
  recommended_next_steps: string;
  disclaimer: string;
  created_at: string;
}

export interface LandRecord {
  id: number;
  record_id: string;
  khatian_no: string;
  plot_no: string;
  mouza: string;
  district: string;
  division: string;
  land_type: string;
  area_acres: number;
  recorded_owner_id?: number | null;
  recorded_owner?: SyntheticOwner | null;
  record_status: string;
  last_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  transactions?: OwnershipTransaction[];
  mutations?: MutationHistory[];
  documents?: DocumentReference[];
  alerts?: FraudAlert[];
  verification_reports?: VerificationReport[];
}

export interface DashboardStats {
  summary: {
    total_records: number;
    records_screened: number;
    documents_verified?: number;
    high_risk_cases: number;
    medium_risk_cases: number;
    no_conflict_cases: number;
    record_mismatches?: number;
    open_alerts: number;
    total_alerts: number;
  };
  risk_distribution: {
    name: string;
    value: number;
    color: string;
  }[];
  monthly_activity: {
    month: string;
    screened: number;
    highRisk: number;
    mediumRisk: number;
  }[];
  recent_reports: VerificationReport[];
  recent_alerts: FraudAlert[];
  recently_screened_records: LandRecord[];
}

export interface DocumentVerifyResult {
  success: boolean;
  filename?: string;
  computed_hash?: string;
  reference_hash?: string;
  is_match?: boolean;
  status?: 'MATCH' | 'MISMATCH';
  explanation?: string;
  disclaimer?: string;
  error?: string;
}

export interface GraphNode {
  id: string;
  type: 'parcel' | 'deed' | 'owner' | 'mutation' | 'alert';
  label: string;
  sublabel?: string;
  title?: string;
  deed_number?: string;
  status?: string;
  date?: string;
  value_bdt?: number;
  phone?: string;
  details?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  is_conflict?: boolean;
  style?: 'solid' | 'dashed';
  color?: string;
}

export interface FraudGraphData {
  success: boolean;
  record_id: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  summary: {
    total_nodes: number;
    total_edges: number;
    conflicts_count: number;
  };
}

export interface TimelineEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  description: string;
  status_badge: string;
  badge_variant: 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  type: string;
  party?: string;
  details?: Record<string, any>;
}

export interface TimelineData {
  success: boolean;
  record_id: string;
  events: TimelineEvent[];
  summary?: {
    total_events: number;
    parcel_id: string;
    khatian_no: string;
    plot_no: string;
  };
}

export interface SimulationResult {
  success: boolean;
  is_synthetic_simulation: boolean;
  record_id: string;
  scenario: string;
  scenario_explanation: string;
  available_deeds: { id: number; deed_number: string; status: string; date?: string }[];
  before: {
    score: number;
    risk_band: 'LOW' | 'MEDIUM' | 'HIGH';
    status: string;
    triggered_rules: string[];
  };
  after: {
    score: number;
    risk_band: 'LOW' | 'MEDIUM' | 'HIGH';
    status: string;
    triggered_rules: string[];
  };
  score_delta: number;
  resolved_rules: string[];
  remaining_rules: string[];
  rule_comparison: {
    rule_code: string;
    rule_name: string;
    before_status: string;
    after_status: string;
    resolved: boolean;
  }[];
  disclaimer: string;
}

export interface FraudDnaCluster {
  cluster_id: string;
  title: string;
  category: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  confidence_pct: number;
  pattern_summary: string;
  recurring_indicators: string[];
  affected_parcels: string[];
  evidence_count: number;
  verifiable_facts: string[];
  recommended_action: string;
}

export interface FraudDnaResponse {
  success: boolean;
  is_synthetic_demo: boolean;
  total_clusters: number;
  clusters: FraudDnaCluster[];
  summary: {
    high_severity_patterns: number;
    medium_severity_patterns: number;
    total_flagged_parcels: number;
  };
}
