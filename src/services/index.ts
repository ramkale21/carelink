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
} from './interfaces';

import {
  MockPatientService,
  MockAppointmentService,
  MockDoctorService,
  MockHospitalService,
  MockMedicalRecordService,
  MockReferralService,
  MockPrescriptionService,
  MockPharmacyService,
  MockHealthWorkerService,
  MockNotificationService,
  MockTriageService,
  MockAnalyticsService,
} from './client/mockServices';

import {
  ApiPatientService,
  ApiAppointmentService,
  ApiDoctorService,
  ApiHospitalService,
  ApiMedicalRecordService,
  ApiReferralService,
  ApiPrescriptionService,
  ApiPharmacyService,
  ApiHealthWorkerService,
  ApiNotificationService,
  ApiTriageService,
  ApiAnalyticsService,
} from './api/apiServices';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

export const patientService: IPatientService = USE_MOCK ? new MockPatientService() : new ApiPatientService();
export const appointmentService: IAppointmentService = USE_MOCK ? new MockAppointmentService() : new ApiAppointmentService();
export const doctorService: IDoctorService = USE_MOCK ? new MockDoctorService() : new ApiDoctorService();
export const hospitalService: IHospitalService = USE_MOCK ? new MockHospitalService() : new ApiHospitalService();
export const medicalRecordService: IMedicalRecordService = USE_MOCK ? new MockMedicalRecordService() : new ApiMedicalRecordService();
export const referralService: IReferralService = USE_MOCK ? new MockReferralService() : new ApiReferralService();
export const prescriptionService: IPrescriptionService = USE_MOCK ? new MockPrescriptionService() : new ApiPrescriptionService();
export const pharmacyService: IPharmacyService = USE_MOCK ? new MockPharmacyService() : new ApiPharmacyService();
export const healthWorkerService: IHealthWorkerService = USE_MOCK ? new MockHealthWorkerService() : new ApiHealthWorkerService();
export const notificationService: INotificationService = USE_MOCK ? new MockNotificationService() : new ApiNotificationService();
export const triageService: ITriageService = USE_MOCK ? new MockTriageService() : new ApiTriageService();
export const analyticsService: IAnalyticsService = USE_MOCK ? new MockAnalyticsService() : new ApiAnalyticsService();

export * from './interfaces';
export * from '../types';
