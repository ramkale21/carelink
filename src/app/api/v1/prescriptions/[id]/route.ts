import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
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
    const rx = await PrescriptionService.getPrescriptionById(id);

    return apiSuccess(rx, "Prescription details retrieved", 200);
  } catch (error: any) {
    return apiError("PRESCRIPTION_NOT_FOUND", error?.message || "Prescription not found", 404);
  }
}
