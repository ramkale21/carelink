# CareLink Frontend-to-Backend Integration Guide

This document defines the exact mapping between the CareLink Presentation Layer (`src/services/*`) and the underlying CareLink REST API (`/api/v1/*`).

---

## Architectural Concept

The CareLink Frontend uses a decoupled Service Abstraction:

```text
               CARELINK FRONTEND UI COMPONENTS
                              │
                              ▼
                Frontend Domain Types (src/types)
                              │
                              ▼
                 Service Interfaces (src/services/interfaces.ts)
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
   Mock Service Implementation         API Service Implementation
   (src/services/client/mockServices.ts) (src/services/api/apiServices.ts)
            │                                   │
            ▼                                   ▼
   Local In-Memory / Storage State      CareLink REST API (/api/v1/*)
```

To switch from Mock Data mode to Live Backend API mode, update the environment variable in `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_BASE_URL=/api/v1
```

Zero UI code changes are needed when connecting the frontend to the backend.

---

## Comprehensive API Endpoint Mapping Table

| Frontend Service Method | HTTP Method | Backend API Endpoint | Request Body | Response Payload |
| :--- | :--- | :--- | :--- | :--- |
| `PatientService.getPatientById(id)` | `GET` | `/api/v1/patients/:id` | None | `{ data: Patient }` |
| `PatientService.getPatients(district)` | `GET` | `/api/v1/patients?district=:district` | None | `{ data: Patient[] }` |
| `PatientService.registerPatient(data)` | `POST` | `/api/v1/patients` | `Partial<Patient>` | `{ data: Patient }` |
| `PatientService.updatePatient(id, data)` | `PATCH` | `/api/v1/patients/:id` | `Partial<Patient>` | `{ data: Patient }` |
| `AppointmentService.getAppointmentsByPatient(id)` | `GET` | `/api/v1/appointments?patientId=:id` | None | `{ data: Appointment[] }` |
| `AppointmentService.getAppointmentsByDoctor(id, date)` | `GET` | `/api/v1/appointments?doctorId=:id&date=:date` | None | `{ data: Appointment[] }` |
| `AppointmentService.bookAppointment(data)` | `POST` | `/api/v1/appointments` | `{ patientId, doctorId, hospitalId, date, time, reason }` | `{ data: Appointment }` |
| `AppointmentService.updateAppointmentStatus(id, status)` | `PATCH` | `/api/v1/appointments/:id/status` | `{ status }` | `{ data: Appointment }` |
| `AppointmentService.getDoctorQueue(doctorId, date)` | `GET` | `/api/v1/doctors/:doctorId/queue?date=:date` | None | `{ data: QueueEntry[] }` |
| `DoctorService.getDoctors(filters)` | `GET` | `/api/v1/doctors?specialization=&hospitalId=&search=` | None | `{ data: Doctor[] }` |
| `DoctorService.getDoctorById(id)` | `GET` | `/api/v1/doctors/:id` | None | `{ data: Doctor }` |
| `DoctorService.updateAvailability(id, isAvailable)` | `PATCH` | `/api/v1/doctors/:id/availability` | `{ isAvailable: boolean }` | `{ data: Doctor }` |
| `HospitalService.getHospitals(filters)` | `GET` | `/api/v1/hospitals?type=&district=&search=&emergency=` | None | `{ data: Hospital[] }` |
| `HospitalService.getHospitalById(id)` | `GET` | `/api/v1/hospitals/:id` | None | `{ data: Hospital }` |
| `HospitalService.getBedCapacities(hospitalId)` | `GET` | `/api/v1/hospitals/:hospitalId/beds` | None | `{ data: BedCategory[] }` |
| `HospitalService.updateBedCapacity(hospitalId, cat, updates)` | `PATCH` | `/api/v1/hospitals/:hospitalId/beds/:category` | `Partial<BedCategory>` | `{ data: BedCategory[] }` |
| `MedicalRecordService.getRecordsByPatient(patientId)` | `GET` | `/api/v1/medical-records?patientId=:id` | None | `{ data: MedicalRecord[] }` |
| `MedicalRecordService.createRecord(data)` | `POST` | `/api/v1/medical-records` | `Omit<MedicalRecord, 'id'>` | `{ data: MedicalRecord }` |
| `MedicalRecordService.getLabReportsByPatient(patientId)` | `GET` | `/api/v1/lab-reports?patientId=:id` | None | `{ data: LabReport[] }` |
| `MedicalRecordService.uploadLabReport(data)` | `POST` | `/api/v1/lab-reports` | `{ patientId, hospitalId, reportType, fileUrl }` | `{ data: LabReport }` |
| `ReferralService.getReferralsByPatient(patientId)` | `GET` | `/api/v1/referrals?patientId=:id` | None | `{ data: Referral[] }` |
| `ReferralService.getReferralsByHospital(id, type)` | `GET` | `/api/v1/referrals?hospitalId=:id&type=:type` | None | `{ data: Referral[] }` |
| `ReferralService.createReferral(data)` | `POST` | `/api/v1/referrals` | `Omit<Referral, 'id'>` | `{ data: Referral }` |
| `ReferralService.updateReferralStatus(id, status)` | `PATCH` | `/api/v1/referrals/:id/status` | `{ status }` | `{ data: Referral }` |
| `PrescriptionService.getPrescriptionsByPatient(id)` | `GET` | `/api/v1/prescriptions?patientId=:id` | None | `{ data: Prescription[] }` |
| `PrescriptionService.createPrescription(data)` | `POST` | `/api/v1/prescriptions` | `Omit<Prescription, 'id'>` | `{ data: Prescription }` |
| `PharmacyService.getOrders(pharmacyId)` | `GET` | `/api/v1/pharmacies/:pharmacyId/orders` | None | `{ data: PrescriptionOrder[] }` |
| `PharmacyService.getInventory(pharmacyId)` | `GET` | `/api/v1/pharmacies/:pharmacyId/inventory` | None | `{ data: InventoryItem[] }` |
| `PharmacyService.dispenseOrder(orderId)` | `POST` | `/api/v1/pharmacies/orders/:orderId/dispense` | None | `{ data: PrescriptionOrder }` |
| `PharmacyService.updateStock(id, newQuantity)` | `PATCH` | `/api/v1/pharmacies/inventory/:id` | `{ quantity: number }` | `{ data: InventoryItem }` |
| `HealthWorkerService.getFollowUps(workerId)` | `GET` | `/api/v1/health-workers/follow-ups?workerId=:id` | None | `{ data: FollowUp[] }` |
| `HealthWorkerService.submitScreening(data)` | `POST` | `/api/v1/health-workers/assessments` | `Omit<HealthAssessment, 'id'>` | `{ data: HealthAssessment }` |
| `TriageService.assessSymptoms(input)` | `POST` | `/api/v1/ml/predict-risk` | `SymptomAssessmentInput` | `{ data: MLRiskResult }` |
| `AnalyticsService.getDashboardAnalytics(role, entityId)`| `GET` | `/api/v1/admin/analytics/:role?entityId=:id` | None | `{ data: AnalyticsSummary }` |

---

## Step-by-Step Connection Instructions

1. Ensure the CareLink backend is running (`npm run dev` in backend root or Docker).
2. Set `NEXT_PUBLIC_USE_MOCK=false` in `.env.local`.
3. Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1` (or your deployment URL).
4. Restart the Next.js frontend dev server (`npm run dev`).
5. All UI components will automatically send HTTP fetch requests via `src/services/api/apiServices.ts` without needing any UI modifications!
