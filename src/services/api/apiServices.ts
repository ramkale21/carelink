import {
  IPatientService,
  IAppointmentService,
  IDoctorService,
  IHospitalService,
  IMedicalRecordService,
  IReferralService,
  IPrescriptionService,
  IPharmacyService,
  IHealthWorkerService,
  INotificationService,
  ITriageService,
  IAnalyticsService,
} from '../interfaces';

import {
  Patient,
  Doctor,
  Hospital,
  Appointment,
  QueueEntry,
  MedicalRecord,
  LabReport,
  Prescription,
  PrescriptionOrder,
  InventoryItem,
  Referral,
  HealthAssessment,
  SymptomAssessmentInput,
  MLRiskResult,
  FollowUp,
  Notification,
  BedCategory,
  AnalyticsSummary,
  UserRole,
} from '../../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'API request failed' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.data ?? data;
}

export class ApiPatientService implements IPatientService {
  async getPatientById(id: string): Promise<Patient | null> {
    return fetchJson<Patient>(`/patients/${id}`);
  }
  async getPatients(district?: string): Promise<Patient[]> {
    const q = district ? `?district=${encodeURIComponent(district)}` : '';
    return fetchJson<Patient[]>(`/patients${q}`);
  }
  async registerPatient(data: Partial<Patient>): Promise<Patient> {
    return fetchJson<Patient>('/patients', { method: 'POST', body: JSON.stringify(data) });
  }
  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    return fetchJson<Patient>(`/patients/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }
}

export class ApiAppointmentService implements IAppointmentService {
  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return fetchJson<Appointment[]>(`/appointments?patientId=${patientId}`);
  }
  async getAppointmentsByDoctor(doctorId: string, date?: string): Promise<Appointment[]> {
    const q = date ? `&date=${date}` : '';
    return fetchJson<Appointment[]>(`/appointments?doctorId=${doctorId}${q}`);
  }
  async getAppointmentsByHospital(hospitalId: string, date?: string): Promise<Appointment[]> {
    const q = date ? `&date=${date}` : '';
    return fetchJson<Appointment[]>(`/appointments?hospitalId=${hospitalId}${q}`);
  }
  async bookAppointment(data: {
    patientId: string;
    doctorId: string;
    hospitalId: string;
    date: string;
    time: string;
    reason: string;
  }): Promise<Appointment> {
    return fetchJson<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(data) });
  }
  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    return fetchJson<Appointment>(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }
  async getDoctorQueue(doctorId: string, date?: string): Promise<QueueEntry[]> {
    const q = date ? `?date=${date}` : '';
    return fetchJson<QueueEntry[]>(`/doctors/${doctorId}/queue${q}`);
  }
}

export class ApiDoctorService implements IDoctorService {
  async getDoctors(filters?: { specialization?: string; hospitalId?: string; search?: string }): Promise<Doctor[]> {
    const params = new URLSearchParams();
    if (filters?.specialization) params.append('specialization', filters.specialization);
    if (filters?.hospitalId) params.append('hospitalId', filters.hospitalId);
    if (filters?.search) params.append('search', filters.search);
    return fetchJson<Doctor[]>(`/doctors?${params.toString()}`);
  }
  async getDoctorById(id: string): Promise<Doctor | null> {
    return fetchJson<Doctor>(`/doctors/${id}`);
  }
  async updateAvailability(doctorId: string, isAvailable: boolean): Promise<Doctor> {
    return fetchJson<Doctor>(`/doctors/${doctorId}/availability`, { method: 'PATCH', body: JSON.stringify({ isAvailable }) });
  }
}

export class ApiHospitalService implements IHospitalService {
  async getHospitals(filters?: { type?: string; district?: string; search?: string; emergency?: boolean }): Promise<Hospital[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.emergency) params.append('emergency', 'true');
    if (filters?.search) params.append('search', filters.search);
    return fetchJson<Hospital[]>(`/hospitals?${params.toString()}`);
  }
  async getHospitalById(id: string): Promise<Hospital | null> {
    return fetchJson<Hospital>(`/hospitals/${id}`);
  }
  async getBedCapacities(hospitalId: string): Promise<BedCategory[]> {
    return fetchJson<BedCategory[]>(`/hospitals/${hospitalId}/beds`);
  }
  async updateBedCapacity(hospitalId: string, category: BedCategory['category'], updates: Partial<BedCategory>): Promise<BedCategory[]> {
    return fetchJson<BedCategory[]>(`/hospitals/${hospitalId}/beds/${category}`, { method: 'PATCH', body: JSON.stringify(updates) });
  }
}

export class ApiMedicalRecordService implements IMedicalRecordService {
  async getRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
    return fetchJson<MedicalRecord[]>(`/medical-records?patientId=${patientId}`);
  }
  async createRecord(data: Omit<MedicalRecord, 'id' | 'createdAt'>): Promise<MedicalRecord> {
    return fetchJson<MedicalRecord>('/medical-records', { method: 'POST', body: JSON.stringify(data) });
  }
  async getLabReportsByPatient(patientId: string): Promise<LabReport[]> {
    return fetchJson<LabReport[]>(`/lab-reports?patientId=${patientId}`);
  }
  async uploadLabReport(data: { patientId: string; hospitalId: string; reportType: string; fileUrl: string }): Promise<LabReport> {
    return fetchJson<LabReport>('/lab-reports', { method: 'POST', body: JSON.stringify(data) });
  }
}

export class ApiReferralService implements IReferralService {
  async getReferralsByPatient(patientId: string): Promise<Referral[]> {
    return fetchJson<Referral[]>(`/referrals?patientId=${patientId}`);
  }
  async getReferralsByHospital(hospitalId: string, type: 'incoming' | 'outgoing'): Promise<Referral[]> {
    return fetchJson<Referral[]>(`/referrals?hospitalId=${hospitalId}&type=${type}`);
  }
  async createReferral(data: Omit<Referral, 'id' | 'createdAt' | 'currentStage' | 'status'>): Promise<Referral> {
    return fetchJson<Referral>('/referrals', { method: 'POST', body: JSON.stringify(data) });
  }
  async updateReferralStatus(id: string, status: Referral['status']): Promise<Referral> {
    return fetchJson<Referral>(`/referrals/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }
}

export class ApiPrescriptionService implements IPrescriptionService {
  async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    return fetchJson<Prescription[]>(`/prescriptions?patientId=${patientId}`);
  }
  async createPrescription(data: Omit<Prescription, 'id' | 'createdAt'>): Promise<Prescription> {
    return fetchJson<Prescription>('/prescriptions', { method: 'POST', body: JSON.stringify(data) });
  }
}

export class ApiPharmacyService implements IPharmacyService {
  async getOrders(pharmacyId: string): Promise<PrescriptionOrder[]> {
    return fetchJson<PrescriptionOrder[]>(`/pharmacies/${pharmacyId}/orders`);
  }
  async getInventory(pharmacyId: string): Promise<InventoryItem[]> {
    return fetchJson<InventoryItem[]>(`/pharmacies/${pharmacyId}/inventory`);
  }
  async dispenseOrder(orderId: string): Promise<PrescriptionOrder> {
    return fetchJson<PrescriptionOrder>(`/pharmacies/orders/${orderId}/dispense`, { method: 'POST' });
  }
  async updateStock(inventoryId: string, newQuantity: number): Promise<InventoryItem> {
    return fetchJson<InventoryItem>(`/pharmacies/inventory/${inventoryId}`, { method: 'PATCH', body: JSON.stringify({ quantity: newQuantity }) });
  }
  async addInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    return fetchJson<InventoryItem>('/pharmacies/inventory', { method: 'POST', body: JSON.stringify(item) });
  }
}

export class ApiHealthWorkerService implements IHealthWorkerService {
  async getFollowUps(workerId?: string): Promise<FollowUp[]> {
    const q = workerId ? `?workerId=${workerId}` : '';
    return fetchJson<FollowUp[]>(`/health-workers/follow-ups${q}`);
  }
  async createFollowUp(data: Omit<FollowUp, 'id'>): Promise<FollowUp> {
    return fetchJson<FollowUp>('/health-workers/follow-ups', { method: 'POST', body: JSON.stringify(data) });
  }
  async markFollowUpComplete(id: string): Promise<FollowUp> {
    return fetchJson<FollowUp>(`/health-workers/follow-ups/${id}/complete`, { method: 'POST' });
  }
  async submitScreening(data: Omit<HealthAssessment, 'id' | 'assessmentDate'>): Promise<HealthAssessment> {
    return fetchJson<HealthAssessment>('/health-workers/assessments', { method: 'POST', body: JSON.stringify(data) });
  }
  async getHealthAssessments(patientId?: string): Promise<HealthAssessment[]> {
    const q = patientId ? `?patientId=${patientId}` : '';
    return fetchJson<HealthAssessment[]>(`/health-workers/assessments${q}`);
  }
}

export class ApiNotificationService implements INotificationService {
  async getNotifications(userId: string): Promise<Notification[]> {
    return fetchJson<Notification[]>(`/notifications?userId=${userId}`);
  }
  async markAsRead(id: string): Promise<void> {
    return fetchJson<void>(`/notifications/${id}/read`, { method: 'POST' });
  }
}

export class ApiTriageService implements ITriageService {
  async assessSymptoms(input: SymptomAssessmentInput): Promise<MLRiskResult> {
    return fetchJson<MLRiskResult>('/ml/predict-risk', { method: 'POST', body: JSON.stringify(input) });
  }
}

export class ApiAnalyticsService implements IAnalyticsService {
  async getDashboardAnalytics(role: UserRole, entityId?: string): Promise<AnalyticsSummary> {
    const q = entityId ? `?entityId=${entityId}` : '';
    return fetchJson<AnalyticsSummary>(`/admin/analytics/${role.toLowerCase()}${q}`);
  }
}
