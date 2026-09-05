import { NextRequest } from "next/server";
import { requireAuth, canAccessPatientData } from "@/lib/permissions";
import { PatientService } from "@/services/patient.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;

    const canAccess = await canAccessPatientData(auth.user, id);
    if (!canAccess) {
      return apiError(
        "FORBIDDEN",
        "You do not have permission to view this patient's records",
        403
      );
    }

    const patient = await PatientService.getPatientById(id);
    return apiSuccess(patient, "Patient record retrieved successfully", 200);
  } catch (error: any) {
    return apiError("PATIENT_NOT_FOUND", error?.message || "Patient profile not found", 404);
  }
}
