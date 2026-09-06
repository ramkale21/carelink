export type UserRole =
  | 'PATIENT'
  | 'DOCTOR'
  | 'HOSPITAL_ADMIN'
  | 'PHARMACIST'
  | 'ASHA'
  | 'ANM'
  | 'CHO'
  | 'SUPER_ADMIN';

export type HospitalType =
  | 'SUB_CENTER'
  | 'PHC'
  | 'CHC'
  | 'DISTRICT_HOSPITAL'
  | 'PRIVATE_HOSPITAL'
  | 'GOVERNMENT_HOSPITAL';

export type AppointmentStatus =
  | 'BOOKED'
  | 'CHECKED_IN'
  | 'WAITING'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type AppointmentPriority = 'NORMAL' | 'HIGH' | 'EMERGENCY';

export type LabReportStatus = 'UPLOADED' | 'PROCESSING' | 'ANALYZED' | 'REVIEWED';

export type ReferralStatus = 'CREATED' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export type WorkerType = 'ASHA' | 'ANM' | 'CHO';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type NotificationType =
  | 'APPOINTMENT'
  | 'PRESCRIPTION'
  | 'LAB_REPORT'
  | 'REFERRAL'
  | 'EMERGENCY'
  | 'FOLLOW_UP'
  | 'SYSTEM';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  phone: string;
  dateOfBirth?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  address?: string;
  village?: string;
  district?: string;
  state?: string;
  emergencyContact?: string;
  preferredLanguage?: 'en' | 'hi';
  medicalHistory?: string[];
  allergies?: string[];
  currentRisk?: RiskLevel;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  specialization: string;
  qualification: string;
  registrationNumber: string;
  experienceYears: number;
  consultationFee: number;
  isAvailable: boolean;
  hospitalId?: string;
  hospitalName?: string;
  availableDays?: string[];
  rating?: number;
}

export interface Hospital {
  id: string;
  name: string;
  registrationNumber: string;
  type: HospitalType;
  address: string;
  village?: string;
  district: string;
  state: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email?: string;
  emergencyAvailable: boolean;
  services?: string[];
  distanceKm?: number;
  availableBeds?: number;
  totalBeds?: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization?: string;
  hospitalId: string;
  hospitalName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  tokenNumber?: number;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  reason?: string;
  createdAt: string;
}

export interface QueueEntry {
  tokenNumber: number;
  appointmentId: string;
  patientId: string;
  patientName: string;
  age?: number;
  gender?: string;
  riskLevel: RiskLevel;
  appointmentTime: string;
  priority: AppointmentPriority;
  status: AppointmentStatus;
  waitTimeMinutes?: number;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  recordType: 'CONSULTATION' | 'EMERGENCY' | 'DISCHARGE' | 'CHECKUP';
  diagnosis: string;
  notes?: string;
  treatment?: string;
  createdAt: string;
}

export interface LabResult {
  id: string;
  parameter: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  abnormalFlag: boolean;
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  hospitalId: string;
  hospitalName: string;
  uploadedBy: string;
  fileUrl: string;
  reportType: string;
  extractedText?: string;
  reportDate: string;
  status: LabReportStatus;
  results: LabResult[];
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  strength: string;
  form: string;
}

export interface PrescriptionMedicine {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  instructions?: string;
  createdAt: string;
  medicines: PrescriptionMedicine[];
}

export interface Pharmacy {
  id: string;
  hospitalId: string;
  hospitalName: string;
  name: string;
  address: string;
  phone: string;
}

export interface InventoryItem {
  id: string;
  pharmacyId: string;
  medicineId: string;
  medicineName: string;
  category: string;
  quantity: number;
  batchNumber: string;
  expiryDate: string;
  price: number;
  isLowStock?: boolean;
}

export interface PrescriptionOrder {
  id: string;
  prescriptionId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  hospitalName: string;
  orderDate: string;
  status: 'PENDING' | 'DISPENSED' | 'CANCELLED';
  medicines: PrescriptionMedicine[];
  totalPrice: number;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  fromHospitalId: string;
  fromHospitalName: string;
  toHospitalId: string;
  toHospitalName: string;
  doctorId?: string;
  doctorName?: string;
  reason: string;
  priority: AppointmentPriority;
  status: ReferralStatus;
  createdAt: string;
  currentStage: 'Created' | 'Under Review' | 'Accepted' | 'Scheduled' | 'Completed';
}

export interface HealthcareWorker {
  id: string;
  userId: string;
  name: string;
  workerType: WorkerType;
  village: string;
  district: string;
  state: string;
  assignedFacilityId?: string;
  assignedFacilityName?: string;
  assignedPatientsCount?: number;
}

export interface HealthAssessment {
  id: string;
  patientId: string;
  patientName: string;
  workerId: string;
  workerName: string;
  symptoms: string[];
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    spo2?: number;
    bloodGlucose?: number;
  };
  assessmentDate: string;
  riskLevel: RiskLevel;
  notes?: string;
}

export interface SymptomAssessmentInput {
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  additionalInfo?: string;
  age?: number;
  gender?: string;
}

export interface MLRiskResult {
  riskLevel: RiskLevel;
  confidence: number;
  possibleConditions: string[];
  recommendedAction: string;
  nextSteps: string[];
  requiresEmergency: boolean;
  recommendedFacilityType: HospitalType;
}

export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName?: string;
  hospitalId?: string;
  hospitalName?: string;
  followUpDate: string;
  reason: string;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
  notes?: string;
  riskLevel?: RiskLevel;
}

export interface BedCategory {
  category: 'ICU' | 'General' | 'Emergency' | 'Pediatric' | 'Maternity';
  available: number;
  occupied: number;
  reserved: number;
  maintenance: number;
  total: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface AnalyticsSummary {
  patientCount: number;
  appointmentsToday: number;
  pendingReferrals: number;
  emergencyCount: number;
  bedOccupancyRate: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}
