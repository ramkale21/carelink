import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { PrescriptionService } from "@/services/prescription.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authorizeRole(req, [
      UserRole.PHARMACIST,
      UserRole.HOSPITAL_ADMIN,
      UserRole.SUPER_ADMIN,
    ]);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const pharmacyId = body.pharmacyId || "pharma_default";

    const result = await PrescriptionService.dispensePrescription(id, pharmacyId);
    return apiSuccess(result, "Prescription dispensed successfully", 200);
  } catch (error: any) {
    return apiError("DISPENSE_FAILED", error?.message || "Failed to dispense prescription", 500);
  }
}
