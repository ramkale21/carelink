import { z } from "zod";

export const CreateMedicalRecordSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  hospitalId: z.string().min(1, "Hospital ID is required"),
  recordType: z.string().default("CONSULTATION"),
  diagnosis: z.string().min(2, "Diagnosis is required"),
  notes: z.string().optional(),
  treatment: z.string().optional(),
});

export const UpdateMedicalRecordSchema = z.object({
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  treatment: z.string().optional(),
});

export const UploadLabReportSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  hospitalId: z.string().min(1, "Hospital ID is required"),
  reportType: z.string().min(2, "Report type required (e.g. BLOOD_CBC)"),
  fileUrl: z.string().url("Valid report file URL required"),
  extractedText: z.string().optional(),
  results: z
    .array(
      z.object({
        parameter: z.string(),
        value: z.string(),
        unit: z.string().optional(),
        referenceRange: z.string().optional(),
        abnormalFlag: z.boolean().default(false),
      })
    )
    .optional(),
});

export const CreatePrescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient ID required"),
  doctorId: z.string().min(1, "Doctor ID required"),
  appointmentId: z.string().optional(),
  instructions: z.string().optional(),
  medicines: z.array(
    z.object({
      medicineId: z.string().min(1, "Medicine ID required"),
      dosage: z.string().min(1, "Dosage required (e.g. 500mg)"),
      frequency: z.string().min(1, "Frequency required (e.g. 1-0-1)"),
      duration: z.string().min(1, "Duration required (e.g. 5 days)"),
      instructions: z.string().optional(),
    })
  ).min(1, "At least one medicine is required"),
});

export const AddInventorySchema = z.object({
  medicineId: z.string().min(1, "Medicine ID required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  batchNumber: z.string().min(1, "Batch number required"),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry date must be YYYY-MM-DD"),
  price: z.number().min(0).default(0.0),
});

export const UpdateInventorySchema = z.object({
  quantity: z.number().optional(),
  price: z.number().optional(),
});

export type CreateMedicalRecordInput = z.infer<typeof CreateMedicalRecordSchema>;
export type UpdateMedicalRecordInput = z.infer<typeof UpdateMedicalRecordSchema>;
export type UploadLabReportInput = z.infer<typeof UploadLabReportSchema>;
export type CreatePrescriptionInput = z.infer<typeof CreatePrescriptionSchema>;
export type AddInventoryInput = z.infer<typeof AddInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof UpdateInventorySchema>;
