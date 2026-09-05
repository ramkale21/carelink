import { z } from "zod";
import { AppointmentPriority, ReferralStatus, RiskLevel } from "@prisma/client";

export const CreateReferralSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  fromHospitalId: z.string().min(1, "From Hospital ID is required"),
  toHospitalId: z.string().min(1, "To Hospital ID is required"),
  doctorId: z.string().optional(),
  reason: z.string().min(3, "Referral reason is required"),
  priority: z.nativeEnum(AppointmentPriority).default(AppointmentPriority.NORMAL),
});

export const UpdateReferralStatusSchema = z.object({
  status: z.nativeEnum(ReferralStatus),
});

export const CommunityPatientRegisterSchema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Must be valid 10-digit Indian phone number"),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  village: z.string().min(1, "Village required"),
  district: z.string().min(1, "District required"),
  state: z.string().min(1, "State required"),
  emergencyContact: z.string().optional(),
  preferredLanguage: z.string().default("en"),
});

export const CreateHealthAssessmentSchema = z.object({
  patientId: z.string().min(1, "Patient ID required"),
  symptoms: z.array(z.string()).min(1, "At least one symptom required"),
  vitals: z.any().optional(),
  bloodPressure: z.string().optional(),
  heartRate: z.number().optional(),
  temperature: z.number().optional(),
  spo2: z.number().optional(),
  bloodGlucose: z.number().optional(),
  riskLevel: z.nativeEnum(RiskLevel).default(RiskLevel.LOW),
});

export const CreateFollowUpSchema = z.object({
  patientId: z.string().min(1, "Patient ID required"),
  doctorId: z.string().optional(),
  hospitalId: z.string().optional(),
  appointmentId: z.string().optional(),
  followUpDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  reason: z.string().min(2, "Follow-up reason required"),
  notes: z.string().optional(),
});

export const UpdateFollowUpSchema = z.object({
  status: z.string(), // PENDING, COMPLETED, MISSED
  notes: z.string().optional(),
});

export type CreateReferralInput = z.infer<typeof CreateReferralSchema>;
export type UpdateReferralStatusInput = z.infer<typeof UpdateReferralStatusSchema>;
export type CommunityPatientRegisterInput = z.infer<typeof CommunityPatientRegisterSchema>;
export type CreateHealthAssessmentInput = z.infer<typeof CreateHealthAssessmentSchema>;
export type CreateFollowUpInput = z.infer<typeof CreateFollowUpSchema>;
export type UpdateFollowUpInput = z.infer<typeof UpdateFollowUpSchema>;
