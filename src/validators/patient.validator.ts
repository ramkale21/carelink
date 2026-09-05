import { z } from "zod";

export const UpdatePatientProfileSchema = z.object({
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  village: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  emergencyContact: z.string().optional(),
  preferredLanguage: z.string().optional(),
  medicalHistory: z.any().optional(),
  allergies: z.any().optional(),
});

export type UpdatePatientProfileInput = z.infer<typeof UpdatePatientProfileSchema>;
