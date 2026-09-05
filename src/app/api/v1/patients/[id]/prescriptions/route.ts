import { NextRequest } from "next/server";
import { requireAuth, canAccessPatientData } from "@/lib/permissions";
import { PrescriptionService } from "@/services/prescription.service";
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
      return apiError("FORBIDDEN", "Access denied to patient prescriptions", 403);
    }

    const rxList = await PrescriptionService.getPatientPrescriptions(id);
    return apiSuccess(rxList, "Patient prescriptions retrieved", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch prescriptions", 500);
  }
}
