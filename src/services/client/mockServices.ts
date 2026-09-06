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

import {
  INITIAL_PATIENTS,
  INITIAL_HOSPITALS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_LAB_REPORTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_INVENTORY,
  INITIAL_PRESCRIPTION_ORDERS,
  INITIAL_REFERRALS,
  INITIAL_BEDS,
  INITIAL_FOLLOW_UPS,
  INITIAL_HEALTH_ASSESSMENTS,
  INITIAL_NOTIFICATIONS,
} from './mockData';

// Helper for local storage persistence
function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(`carelink_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`carelink_${key}`, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors
  }
}

export class MockPatientService implements IPatientService {
  private patients: Patient[] = getStorage('patients', INITIAL_PATIENTS);

  async getPatientById(id: string): Promise<Patient | null> {
    return this.patients.find((p) => p.id === id || p.userId === id) || null;
  }

  async getPatients(district?: string): Promise<Patient[]> {
    if (district) {
      return this.patients.filter((p) => p.district?.toLowerCase() === district.toLowerCase());
    }
    return this.patients;
  }

  async registerPatient(data: Partial<Patient>): Promise<Patient> {
    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      userId: `usr-${Date.now()}`,
      name: data.name || 'New Patient',
      phone: data.phone || '+91 90000 00000',
      dateOfBirth: data.dateOfBirth || '1995-01-01',
      age: data.age || 30,
      gender: data.gender || 'Male',
      bloodGroup: data.bloodGroup || 'O+',
      village: data.village || 'Anandpur',
      district: data.district || 'Pune',
      state: data.state || 'Maharashtra',
      preferredLanguage: data.preferredLanguage || 'en',
      medicalHistory: data.medicalHistory || [],
      allergies: data.allergies || [],
      currentRisk: data.currentRisk || 'LOW',
    };
    this.patients.unshift(newPatient);
    setStorage('patients', this.patients);
    return newPatient;
  }

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    const idx = this.patients.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Patient not found');
    this.patients[idx] = { ...this.patients[idx], ...data };
    setStorage('patients', this.patients);
    return this.patients[idx];
  }
}

export class MockAppointmentService implements IAppointmentService {
  private appointments: Appointment[] = getStorage('appointments', INITIAL_APPOINTMENTS);

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return this.appointments.filter((a) => a.patientId === patientId);
  }

  async getAppointmentsByDoctor(doctorId: string, date?: string): Promise<Appointment[]> {
    return this.appointments.filter((a) => a.doctorId === doctorId && (!date || a.appointmentDate === date));
  }

  async getAppointmentsByHospital(hospitalId: string, date?: string): Promise<Appointment[]> {
    return this.appointments.filter((a) => a.hospitalId === hospitalId && (!date || a.appointmentDate === date));
  }

  async bookAppointment(data: {
    patientId: string;
    doctorId: string;
    hospitalId: string;
    date: string;
    time: string;
    reason: string;
  }): Promise<Appointment> {
    const patientService = new MockPatientService();
    const doctorService = new MockDoctorService();
    const hospitalService = new MockHospitalService();

    const patient = await patientService.getPatientById(data.patientId);
    const doctor = await doctorService.getDoctorById(data.doctorId);
    const hospital = await hospitalService.getHospitalById(data.hospitalId);

    const existingCount = this.appointments.filter(
      (a) => a.doctorId === data.doctorId && a.appointmentDate === data.date
    ).length;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: data.patientId,
      patientName: patient?.name || 'Patient',
      doctorId: data.doctorId,
      doctorName: doctor?.name || 'Doctor',
      doctorSpecialization: doctor?.specialization || 'General',
      hospitalId: data.hospitalId,
      hospitalName: hospital?.name || 'CareLink Facility',
      appointmentDate: data.date,
      startTime: data.time,
      endTime: '10:30',
      tokenNumber: existingCount + 1,
      status: 'BOOKED',
      priority: patient?.currentRisk === 'CRITICAL' ? 'EMERGENCY' : patient?.currentRisk === 'HIGH' ? 'HIGH' : 'NORMAL',
      reason: data.reason,
      createdAt: new Date().toISOString(),
    };

    this.appointments.unshift(newApt);
    setStorage('appointments', this.appointments);
    return newApt;
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    const idx = this.appointments.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Appointment not found');
    this.appointments[idx].status = status;
    setStorage('appointments', this.appointments);
    return this.appointments[idx];
  }

  async getDoctorQueue(doctorId: string, date: string = '2026-09-06'): Promise<QueueEntry[]> {
    const apts = await this.getAppointmentsByDoctor(doctorId, date);
    return apts.map((a, idx) => ({
      tokenNumber: a.tokenNumber || idx + 1,
      appointmentId: a.id,
      patientId: a.patientId,
      patientName: a.patientName,
      age: 40 + idx * 5,
      gender: idx % 2 === 0 ? 'Male' : 'Female',
      riskLevel: a.priority === 'EMERGENCY' ? 'CRITICAL' : a.priority === 'HIGH' ? 'HIGH' : 'LOW',
      appointmentTime: a.startTime,
      priority: a.priority,
      status: a.status,
      waitTimeMinutes: idx * 12,
    }));
  }
}

export class MockDoctorService implements IDoctorService {
  private doctors: Doctor[] = getStorage('doctors', INITIAL_DOCTORS);

  async getDoctors(filters?: { specialization?: string; hospitalId?: string; search?: string }): Promise<Doctor[]> {
    let result = [...this.doctors];
    if (filters?.specialization) {
      result = result.filter((d) => d.specialization.toLowerCase().includes(filters.specialization!.toLowerCase()));
    }
    if (filters?.hospitalId) {
      result = result.filter((d) => d.hospitalId === filters.hospitalId);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((d) => d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q));
    }
    return result;
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    return this.doctors.find((d) => d.id === id || d.userId === id) || null;
  }

  async updateAvailability(doctorId: string, isAvailable: boolean): Promise<Doctor> {
    const idx = this.doctors.findIndex((d) => d.id === doctorId);
    if (idx === -1) throw new Error('Doctor not found');
    this.doctors[idx].isAvailable = isAvailable;
    setStorage('doctors', this.doctors);
    return this.doctors[idx];
  }
}

export class MockHospitalService implements IHospitalService {
  private hospitals: Hospital[] = getStorage('hospitals', INITIAL_HOSPITALS);
  private beds: BedCategory[] = getStorage('beds', INITIAL_BEDS);

  async getHospitals(filters?: { type?: string; district?: string; search?: string; emergency?: boolean }): Promise<Hospital[]> {
    let result = [...this.hospitals];
    if (filters?.type) {
      result = result.filter((h) => h.type === filters.type);
    }
    if (filters?.district) {
      result = result.filter((h) => h.district.toLowerCase() === filters.district!.toLowerCase());
    }
    if (filters?.emergency) {
      result = result.filter((h) => h.emergencyAvailable);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((h) => h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q));
    }
    return result;
  }

  async getHospitalById(id: string): Promise<Hospital | null> {
    return this.hospitals.find((h) => h.id === id) || null;
  }

  async getBedCapacities(_hospitalId: string): Promise<BedCategory[]> {
    return this.beds;
  }

  async updateBedCapacity(_hospitalId: string, category: BedCategory['category'], updates: Partial<BedCategory>): Promise<BedCategory[]> {
    const idx = this.beds.findIndex((b) => b.category === category);
    if (idx !== -1) {
      this.beds[idx] = { ...this.beds[idx], ...updates };
      setStorage('beds', this.beds);
    }
    return this.beds;
  }
}

export class MockMedicalRecordService implements IMedicalRecordService {
  private records: MedicalRecord[] = getStorage('medical_records', INITIAL_MEDICAL_RECORDS);
  private labReports: LabReport[] = getStorage('lab_reports', INITIAL_LAB_REPORTS);

  async getRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
    return this.records.filter((r) => r.patientId === patientId);
  }

  async createRecord(data: Omit<MedicalRecord, 'id' | 'createdAt'>): Promise<MedicalRecord> {
    const newRecord: MedicalRecord = {
      ...data,
      id: `rec-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.records.unshift(newRecord);
    setStorage('medical_records', this.records);
    return newRecord;
  }

  async getLabReportsByPatient(patientId: string): Promise<LabReport[]> {
    return this.labReports.filter((l) => l.patientId === patientId);
  }

  async uploadLabReport(data: { patientId: string; hospitalId: string; reportType: string; fileUrl: string }): Promise<LabReport> {
    const newReport: LabReport = {
      id: `lab-${Date.now()}`,
      patientId: data.patientId,
      patientName: 'Ravi Patil',
      hospitalId: data.hospitalId,
      hospitalName: 'PHC Khed Diagnostics',
      uploadedBy: 'Clinical Staff',
      fileUrl: data.fileUrl,
      reportType: data.reportType,
      reportDate: new Date().toISOString().split('T')[0],
      status: 'PROCESSING',
      results: [],
    };
    this.labReports.unshift(newReport);
    setStorage('lab_reports', this.labReports);
    return newReport;
  }
}

export class MockReferralService implements IReferralService {
  private referrals: Referral[] = getStorage('referrals', INITIAL_REFERRALS);

  async getReferralsByPatient(patientId: string): Promise<Referral[]> {
    return this.referrals.filter((r) => r.patientId === patientId);
  }

  async getReferralsByHospital(hospitalId: string, type: 'incoming' | 'outgoing'): Promise<Referral[]> {
    return this.referrals.filter((r) => (type === 'incoming' ? r.toHospitalId === hospitalId : r.fromHospitalId === hospitalId));
  }

  async createReferral(data: Omit<Referral, 'id' | 'createdAt' | 'currentStage' | 'status'>): Promise<Referral> {
    const newRef: Referral = {
      ...data,
      id: `ref-${Date.now()}`,
      status: 'CREATED',
      currentStage: 'Created',
      createdAt: new Date().toISOString(),
    };
    this.referrals.unshift(newRef);
    setStorage('referrals', this.referrals);
    return newRef;
  }

  async updateReferralStatus(id: string, status: Referral['status']): Promise<Referral> {
    const idx = this.referrals.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Referral not found');
    this.referrals[idx].status = status;
    if (status === 'ACCEPTED') this.referrals[idx].currentStage = 'Accepted';
    if (status === 'COMPLETED') this.referrals[idx].currentStage = 'Completed';
    setStorage('referrals', this.referrals);
    return this.referrals[idx];
  }
}

export class MockPrescriptionService implements IPrescriptionService {
  private prescriptions: Prescription[] = getStorage('prescriptions', INITIAL_PRESCRIPTIONS);

  async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    return this.prescriptions.filter((p) => p.patientId === patientId);
  }

  async createPrescription(data: Omit<Prescription, 'id' | 'createdAt'>): Promise<Prescription> {
    const newRx: Prescription = {
      ...data,
      id: `rx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.prescriptions.unshift(newRx);
    setStorage('prescriptions', this.prescriptions);

    // Create corresponding pharmacy order automatically
    const orders = getStorage<PrescriptionOrder[]>('pharmacy_orders', INITIAL_PRESCRIPTION_ORDERS);
    orders.unshift({
      id: `ord-${Date.now()}`,
      prescriptionId: newRx.id,
      patientName: newRx.patientName,
      patientPhone: '+91 98765 43210',
      doctorName: newRx.doctorName,
      hospitalName: 'PHC Khed',
      orderDate: newRx.createdAt,
      status: 'PENDING',
      medicines: newRx.medicines,
      totalPrice: newRx.medicines.length * 40.0,
    });
    setStorage('pharmacy_orders', orders);

    return newRx;
  }
}

export class MockPharmacyService implements IPharmacyService {
  private orders: PrescriptionOrder[] = getStorage('pharmacy_orders', INITIAL_PRESCRIPTION_ORDERS);
  private inventory: InventoryItem[] = getStorage('inventory', INITIAL_INVENTORY);

  async getOrders(_pharmacyId: string): Promise<PrescriptionOrder[]> {
    return this.orders;
  }

  async getInventory(_pharmacyId: string): Promise<InventoryItem[]> {
    return this.inventory;
  }

  async dispenseOrder(orderId: string): Promise<PrescriptionOrder> {
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');
    this.orders[idx].status = 'DISPENSED';
    setStorage('pharmacy_orders', this.orders);
    return this.orders[idx];
  }

  async updateStock(inventoryId: string, newQuantity: number): Promise<InventoryItem> {
    const idx = this.inventory.findIndex((i) => i.id === inventoryId);
    if (idx === -1) throw new Error('Item not found');
    this.inventory[idx].quantity = newQuantity;
    this.inventory[idx].isLowStock = newQuantity < 30;
    setStorage('inventory', this.inventory);
    return this.inventory[idx];
  }

  async addInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      isLowStock: item.quantity < 30,
    };
    this.inventory.unshift(newItem);
    setStorage('inventory', this.inventory);
    return newItem;
  }
}

export class MockHealthWorkerService implements IHealthWorkerService {
  private followUps: FollowUp[] = getStorage('followups', INITIAL_FOLLOW_UPS);
  private assessments: HealthAssessment[] = getStorage('health_assessments', INITIAL_HEALTH_ASSESSMENTS);

  async getFollowUps(_workerId?: string): Promise<FollowUp[]> {
    return this.followUps;
  }

  async createFollowUp(data: Omit<FollowUp, 'id'>): Promise<FollowUp> {
    const newFol: FollowUp = {
      ...data,
      id: `fol-${Date.now()}`,
    };
    this.followUps.unshift(newFol);
    setStorage('followups', this.followUps);
    return newFol;
  }

  async markFollowUpComplete(id: string): Promise<FollowUp> {
    const idx = this.followUps.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error('Follow-up not found');
    this.followUps[idx].status = 'COMPLETED';
    setStorage('followups', this.followUps);
    return this.followUps[idx];
  }

  async submitScreening(data: Omit<HealthAssessment, 'id' | 'assessmentDate'>): Promise<HealthAssessment> {
    const newHa: HealthAssessment = {
      ...data,
      id: `ha-${Date.now()}`,
      assessmentDate: new Date().toISOString(),
    };
    this.assessments.unshift(newHa);
    setStorage('health_assessments', this.assessments);

    // Automatically trigger referral/followup if HIGH or CRITICAL
    if (data.riskLevel === 'HIGH' || data.riskLevel === 'CRITICAL') {
      await this.createFollowUp({
        patientId: data.patientId,
        patientName: data.patientName,
        followUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        reason: `Urgent follow-up for screening symptoms (${data.symptoms.join(', ')})`,
        status: 'PENDING',
        riskLevel: data.riskLevel,
      });
    }

    return newHa;
  }

  async getHealthAssessments(patientId?: string): Promise<HealthAssessment[]> {
    if (patientId) {
      return this.assessments.filter((a) => a.patientId === patientId);
    }
    return this.assessments;
  }
}

export class MockNotificationService implements INotificationService {
  private notifications: Notification[] = getStorage('notifications', INITIAL_NOTIFICATIONS);

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications.filter((n) => n.userId === userId || userId === 'all');
  }

  async markAsRead(id: string): Promise<void> {
    const idx = this.notifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      this.notifications[idx].isRead = true;
      setStorage('notifications', this.notifications);
    }
  }
}

export class MockTriageService implements ITriageService {
  async assessSymptoms(input: SymptomAssessmentInput): Promise<MLRiskResult> {
    const sx = input.symptoms.map((s) => s.toLowerCase());
    const isEmergency =
      sx.some((s) => s.includes('chest pain') || s.includes('unconscious') || s.includes('severe bleeding') || s.includes('breathing difficulty')) ||
      input.severity === 'severe';

    if (isEmergency) {
      return {
        riskLevel: 'CRITICAL',
        confidence: 0.94,
        possibleConditions: ['Acute Cardiac Event / Severe Respiratory Distress', 'Hypertensive Emergency'],
        recommendedAction: 'Immediate emergency evacuation to District Hospital Aundh / Call 108',
        nextSteps: [
          'Call 108 Emergency Ambulance immediately',
          'Keep patient seated or lying down comfortably',
          'Do not administer oral solid food or water',
          'Notify nearest PHC Medical Officer',
        ],
        requiresEmergency: true,
        recommendedFacilityType: 'DISTRICT_HOSPITAL',
      };
    }

    const isHigh = sx.some((s) => s.includes('high fever') || s.includes('vomiting') || s.includes('dizziness')) || input.severity === 'moderate';

    if (isHigh) {
      return {
        riskLevel: 'HIGH',
        confidence: 0.88,
        possibleConditions: ['Acute Febrile Illness (Dengue/Malaria)', 'Bacterial Infection'],
        recommendedAction: 'Consult a Medical Officer at nearest PHC/CHC within 12 hours',
        nextSteps: [
          'Schedule priority consultation at PHC Khed',
          'Ensure hydration with ORS solution',
          'Monitor body temperature every 4 hours',
        ],
        requiresEmergency: false,
        recommendedFacilityType: 'PHC',
      };
    }

    return {
      riskLevel: 'LOW',
      confidence: 0.91,
      possibleConditions: ['Viral Upper Respiratory Infection', 'Mild Fatigue'],
      recommendedAction: 'Routine consultation and symptomatic care at Sub-Center / PHC',
      nextSteps: [
        'Rest and stay hydrated',
        'Over-the-counter Paracetamol if fever exceeds 100°F',
        'Visit Sub-Center if symptoms persist over 3 days',
      ],
      requiresEmergency: false,
      recommendedFacilityType: 'SUB_CENTER',
    };
  }
}

export class MockAnalyticsService implements IAnalyticsService {
  async getDashboardAnalytics(_role: UserRole, _entityId?: string): Promise<AnalyticsSummary> {
    return {
      patientCount: 1420,
      appointmentsToday: 38,
      pendingReferrals: 12,
      emergencyCount: 3,
      bedOccupancyRate: 72.4,
      riskDistribution: {
        low: 840,
        medium: 420,
        high: 135,
        critical: 25,
      },
    };
  }
}
