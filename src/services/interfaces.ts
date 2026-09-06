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
} from '../types';

export interface IPatientService {
  getPatientById(id: string): Promise<Patient | null>;
  getPatients(district?: string): Promise<Patient[]>;
  registerPatient(data: Partial<Patient>): Promise<Patient>;
  updatePatient(id: string, data: Partial<Patient>): Promise<Patient>;
}

export interface IAppointmentService {
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: string, date?: string): Promise<Appointment[]>;
  getAppointmentsByHospital(hospitalId: string, date?: string): Promise<Appointment[]>;
  bookAppointment(data: {
    patientId: string;
    doctorId: string;
    hospitalId: string;
    date: string;
    time: string;
    reason: string;
  }): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment>;
  getDoctorQueue(doctorId: string, date?: string): Promise<QueueEntry[]>;
}

export interface IDoctorService {
  getDoctors(filters?: { specialization?: string; hospitalId?: string; search?: string }): Promise<Doctor[]>;
  getDoctorById(id: string): Promise<Doctor | null>;
  updateAvailability(doctorId: string, isAvailable: boolean): Promise<Doctor>;
}

export interface IHospitalService {
  getHospitals(filters?: { type?: string; district?: string; search?: string; emergency?: boolean }): Promise<Hospital[]>;
  getHospitalById(id: string): Promise<Hospital | null>;
  getBedCapacities(hospitalId: string): Promise<BedCategory[]>;
  updateBedCapacity(hospitalId: string, category: BedCategory['category'], updates: Partial<BedCategory>): Promise<BedCategory[]>;
}

export interface IMedicalRecordService {
  getRecordsByPatient(patientId: string): Promise<MedicalRecord[]>;
  createRecord(data: Omit<MedicalRecord, 'id' | 'createdAt'>): Promise<MedicalRecord>;
  getLabReportsByPatient(patientId: string): Promise<LabReport[]>;
  uploadLabReport(data: { patientId: string; hospitalId: string; reportType: string; fileUrl: string }): Promise<LabReport>;
}

export interface IReferralService {
  getReferralsByPatient(patientId: string): Promise<Referral[]>;
  getReferralsByHospital(hospitalId: string, type: 'incoming' | 'outgoing'): Promise<Referral[]>;
  createReferral(data: Omit<Referral, 'id' | 'createdAt' | 'currentStage' | 'status'>): Promise<Referral>;
  updateReferralStatus(id: string, status: Referral['status']): Promise<Referral>;
}

export interface IPrescriptionService {
  getPrescriptionsByPatient(patientId: string): Promise<Prescription[]>;
  createPrescription(data: Omit<Prescription, 'id' | 'createdAt'>): Promise<Prescription>;
}

export interface IPharmacyService {
  getOrders(pharmacyId: string): Promise<PrescriptionOrder[]>;
  getInventory(pharmacyId: string): Promise<InventoryItem[]>;
  dispenseOrder(orderId: string): Promise<PrescriptionOrder>;
  updateStock(inventoryId: string, newQuantity: number): Promise<InventoryItem>;
  addInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem>;
}

export interface IHealthWorkerService {
  getFollowUps(workerId?: string): Promise<FollowUp[]>;
  createFollowUp(data: Omit<FollowUp, 'id'>): Promise<FollowUp>;
  markFollowUpComplete(id: string): Promise<FollowUp>;
  submitScreening(data: Omit<HealthAssessment, 'id' | 'assessmentDate'>): Promise<HealthAssessment>;
  getHealthAssessments(patientId?: string): Promise<HealthAssessment[]>;
}

export interface INotificationService {
  getNotifications(userId: string): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
}

export interface ITriageService {
  assessSymptoms(input: SymptomAssessmentInput): Promise<MLRiskResult>;
}

export interface IAnalyticsService {
  getDashboardAnalytics(role: UserRole, entityId?: string): Promise<AnalyticsSummary>;
}
