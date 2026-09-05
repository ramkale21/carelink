import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { PatientService } from "@/services/patient.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const patient = await PatientService.getPatientByUserId(auth.user.userId);
    return apiSuccess(patient, "Patient profile retrieved successfully", 200);
  } catch (error: any) {
    return apiError(
      "PATIENT_NOT_FOUND",
      error?.message || "Failed to retrieve patient profile",
      404
    );
  }
}
