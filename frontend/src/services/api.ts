import {
  DashboardStats,
  LandRecord,
  VerificationReport,
  FraudAlert,
  DocumentVerifyResult,
  DocumentReference,
  FraudGraphData,
  TimelineData,
  SimulationResult,
  FraudDnaResponse
} from '../types';

const CONFIGURED_API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const DIRECT_API_FALLBACK = 'http://127.0.0.1:5000/api';

async function fetchApi(endpoint: string, options?: RequestInit): Promise<Response> {
  const primaryUrl = `${CONFIGURED_API_BASE}${endpoint}`;
  try {
    const res = await fetch(primaryUrl, options);
    if (res.ok) return res;

    // If proxy returned 500/502/504 (Vite proxy to backend connection issue), try direct fallback
    if (
      CONFIGURED_API_BASE.startsWith('/') &&
      (res.status === 500 || res.status === 502 || res.status === 504 || res.status === 0)
    ) {
      try {
        const fallbackRes = await fetch(`${DIRECT_API_FALLBACK}${endpoint}`, options);
        if (fallbackRes.ok) return fallbackRes;
      } catch {
        // Fallback also failed
      }
    }
    return res;
  } catch {
    // If network exception (e.g. proxy unreachable, connection refused), try direct backend fallback
    if (CONFIGURED_API_BASE.startsWith('/')) {
      try {
        const fallbackRes = await fetch(`${DIRECT_API_FALLBACK}${endpoint}`, options);
        if (fallbackRes.ok) return fallbackRes;
      } catch {
        // Fallback also failed
      }
    }
    throw new Error(
      'Unable to connect to LandGuard Backend API. Please ensure the Flask server is running at http://127.0.0.1:5000 (command: python backend/run.py).'
    );
  }
}

export const api = {
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetchApi('/dashboard/stats');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch dashboard stats');
    }
    return res.json();
  },

  // Land Records
  async getLandRecords(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    district?: string;
  }): Promise<{
    success: boolean;
    total: number;
    records: LandRecord[];
  }> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.district) query.set('district', params.district);

    const res = await fetchApi(`/land-records?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch land records');
    return res.json();
  },

  async searchLandRecords(
    queryOrParams: string | {
      q?: string;
      district?: string;
      upazila?: string;
      mouza?: string;
      dag_no?: string;
      khatian_no?: string;
      deed_number?: string;
    }
  ): Promise<{
    success: boolean;
    query: string;
    total: number;
    records: LandRecord[];
  }> {
    let queryString = '';
    if (typeof queryOrParams === 'string') {
      queryString = `q=${encodeURIComponent(queryOrParams)}`;
    } else {
      const p = new URLSearchParams();
      if (queryOrParams.q) p.set('q', queryOrParams.q);
      if (queryOrParams.district) p.set('district', queryOrParams.district);
      if (queryOrParams.upazila) p.set('upazila', queryOrParams.upazila);
      if (queryOrParams.mouza) p.set('mouza', queryOrParams.mouza);
      if (queryOrParams.dag_no) p.set('dag_no', queryOrParams.dag_no);
      if (queryOrParams.khatian_no) p.set('khatian_no', queryOrParams.khatian_no);
      if (queryOrParams.deed_number) p.set('deed_number', queryOrParams.deed_number);
      queryString = p.toString();
    }

    const res = await fetchApi(`/land-records/search?${queryString}`);
    if (!res.ok) throw new Error('Failed to search land records');
    return res.json();
  },

  async getLandRecordDetail(recordId: string | number): Promise<{
    success: boolean;
    record: LandRecord;
  }> {
    const res = await fetchApi(`/land-records/${recordId}`);
    if (!res.ok) throw new Error(`Failed to fetch record ${recordId}`);
    return res.json();
  },

  // Verification
  async verifyLandRecord(
    recordId: string,
    notes?: string
  ): Promise<{
    success: boolean;
    report_id: number;
    report_ref: string;
    screening_result: any;
    report: VerificationReport;
  }> {
    const res = await fetchApi(`/verify/${recordId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Verification request failed');
    }
    return res.json();
  },

  async getVerificationReports(params?: {
    risk_band?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    success: boolean;
    total: number;
    reports: VerificationReport[];
  }> {
    const query = new URLSearchParams();
    if (params?.risk_band) query.set('risk_band', params.risk_band);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());

    const res = await fetchApi(`/verification-reports?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch verification reports');
    return res.json();
  },

  async getVerificationReportDetail(reportId: string | number): Promise<{
    success: boolean;
    report: VerificationReport;
  }> {
    const res = await fetchApi(`/verification-reports/${reportId}`);
    if (!res.ok) throw new Error(`Failed to fetch verification report ${reportId}`);
    return res.json();
  },

  // Fraud Alerts
  async getFraudAlerts(params?: {
    risk_band?: string;
    alert_type?: string;
    status?: string;
    record_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    success: boolean;
    total: number;
    alerts: FraudAlert[];
  }> {
    const query = new URLSearchParams();
    if (params?.risk_band) query.set('risk_band', params.risk_band);
    if (params?.alert_type) query.set('alert_type', params.alert_type);
    if (params?.status) query.set('status', params.status);
    if (params?.record_id) query.set('record_id', params.record_id);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());

    const res = await fetchApi(`/fraud-alerts?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch fraud alerts');
    return res.json();
  },

  async updateFraudAlert(
    alertId: string | number,
    status?: string,
    reviewerNotes?: string
  ): Promise<{
    success: boolean;
    message: string;
    alert: FraudAlert;
  }> {
    const res = await fetchApi(`/fraud-alerts/${alertId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        reviewer_notes: reviewerNotes,
      }),
    });
    if (!res.ok) throw new Error('Failed to update alert');
    return res.json();
  },

  // Document Integrity
  async verifyDocumentHash(
    file: File,
    referenceHash?: string,
    documentId?: number
  ): Promise<DocumentVerifyResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (referenceHash) formData.append('reference_hash', referenceHash);
    if (documentId) formData.append('document_id', documentId.toString());

    const res = await fetchApi(`/documents/verify-hash`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  async getDocumentReferences(): Promise<{
    success: boolean;
    documents: DocumentReference[];
  }> {
    const res = await fetchApi(`/documents/references`);
    if (!res.ok) throw new Error('Failed to fetch demo document references');
    return res.json();
  },

  // Fraud Relationship Graph
  async getFraudGraph(recordId: string): Promise<FraudGraphData> {
    const res = await fetchApi(`/graph/${encodeURIComponent(recordId)}`);
    if (!res.ok) throw new Error(`Failed to fetch relationship graph for ${recordId}`);
    return res.json();
  },

  // Ownership & Transfer Timeline
  async getRecordTimeline(recordId: string): Promise<TimelineData> {
    const res = await fetchApi(`/timeline/${encodeURIComponent(recordId)}`);
    if (!res.ok) throw new Error(`Failed to fetch timeline for ${recordId}`);
    return res.json();
  },

  // What-If Simulator
  async evaluateSimulation(payload: {
    record_id: string;
    scenario: string;
    target_deed?: string;
  }): Promise<SimulationResult> {
    const res = await fetchApi(`/simulation/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to evaluate What-If simulation');
    return res.json();
  },

  // Fraud DNA Clusters
  async getFraudDnaClusters(): Promise<FraudDnaResponse> {
    const res = await fetchApi(`/fraud-dna`);
    if (!res.ok) throw new Error('Failed to fetch Fraud DNA clusters');
    return res.json();
  },
};
