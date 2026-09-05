import { z } from "zod";

export const DoctorSearchSchema = z.object({
  specialization: z.string().optional(),
  hospitalId: z.string().optional(),
  district: z.string().optional(),
  isAvailable: z.string().transform((val) => val === "true").optional(),
  query: z.string().optional(),
  page: z.string().transform((val) => parseInt(val, 10) || 1).optional(),
  limit: z.string().transform((val) => parseInt(val, 10) || 20).optional(),
});

export const DoctorScheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time format must be HH:mm"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time format must be HH:mm"),
  slotDuration: z.number().min(5).max(60).default(15),
  maxPatients: z.number().min(1).max(100).default(30),
});

export const UpdateDoctorAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export type DoctorSearchInput = z.infer<typeof DoctorSearchSchema>;
export type DoctorScheduleInput = z.infer<typeof DoctorScheduleSchema>;
