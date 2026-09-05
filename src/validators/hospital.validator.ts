import { z } from "zod";
import { HospitalType } from "@prisma/client";

export const HospitalSearchSchema = z.object({
  district: z.string().optional(),
  state: z.string().optional(),
  type: z.nativeEnum(HospitalType).optional(),
  emergencyOnly: z.string().transform((val) => val === "true").optional(),
  specialty: z.string().optional(),
  query: z.string().optional(),
  page: z.string().transform((val) => parseInt(val, 10) || 1).optional(),
  limit: z.string().transform((val) => parseInt(val, 10) || 20).optional(),
});

export const CreateHospitalSchema = z.object({
  name: z.string().min(3, "Hospital name required"),
  registrationNumber: z.string().min(3, "Registration number required"),
  type: z.nativeEnum(HospitalType),
  address: z.string().min(5, "Address required"),
  village: z.string().optional(),
  district: z.string().min(2, "District required"),
  state: z.string().min(2, "State required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().min(10, "Phone number required"),
  email: z.string().email().optional(),
  emergencyAvailable: z.boolean().default(true),
});

export type HospitalSearchInput = z.infer<typeof HospitalSearchSchema>;
export type CreateHospitalInput = z.infer<typeof CreateHospitalSchema>;
