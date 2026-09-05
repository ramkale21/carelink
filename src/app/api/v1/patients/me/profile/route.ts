import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { UpdatePatientProfileSchema } from "@/validators/patient.validator";
import { PatientService } from "@/services/patient.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const patient = await PatientService.getPatientByUserId(auth.user.userId);
    return apiSuccess(patient, "Patient profile retrieved successfully", 200);
  } catch (error: any) {
    return apiError("PATIENT_NOT_FOUND", error?.message || "Patient profile not found", 404);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const validation = UpdatePatientProfileSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid profile update data",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const updated = await PatientService.updatePatientProfile(
      auth.user.userId,
      validation.data
    );
    return apiSuccess(updated, "Patient profile updated successfully", 200);
  } catch (error: any) {
    return apiError("UPDATE_FAILED", error?.message || "Failed to update profile", 500);
  }
}
