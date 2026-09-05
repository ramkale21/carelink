import { z } from "zod";
import { AppointmentPriority, AppointmentStatus } from "@prisma/client";

export const CreateAppointmentSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  doctorId: z.string().min(1, "Doctor ID is required"),
  hospitalId: z.string().min(1, "Hospital ID is required"),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must be HH:mm"),
  priority: z.nativeEnum(AppointmentPriority).default(AppointmentPriority.NORMAL),
  reason: z.string().optional(),
});

export const QuerySlotsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

export const UpdateAppointmentStatusSchema = z.object({
  status: z.nativeEnum(AppointmentStatus),
  notes: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;
export type QuerySlotsInput = z.infer<typeof QuerySlotsSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof UpdateAppointmentStatusSchema>;
