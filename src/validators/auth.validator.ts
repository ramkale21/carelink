import { z } from "zod";
import { UserRole, WorkerType } from "@prisma/client";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(UserRole).default(UserRole.PATIENT),
  
  // Optional role profile initializers
  patientDetails: z
    .object({
      dateOfBirth: z.string().optional(),
      gender: z.string().optional(),
      bloodGroup: z.string().optional(),
      address: z.string().optional(),
      village: z.string().optional(),
      district: z.string().optional(),
      state: z.string().optional(),
      emergencyContact: z.string().optional(),
      preferredLanguage: z.string().default("en"),
    })
    .optional(),

  doctorDetails: z
    .object({
      hospitalId: z.string().optional(),
      specialization: z.string(),
      qualification: z.string(),
      registrationNumber: z.string(),
      experience: z.number().min(0),
      consultationFee: z.number().min(0).default(0),
    })
    .optional(),

  workerDetails: z
    .object({
      workerType: z.nativeEnum(WorkerType),
      village: z.string(),
      district: z.string(),
      state: z.string(),
      assignedFacilityId: z.string().optional(),
    })
    .optional(),
});

export const LoginSchema = z.object({
  phoneOrEmail: z.string().min(1, "Phone number or Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
