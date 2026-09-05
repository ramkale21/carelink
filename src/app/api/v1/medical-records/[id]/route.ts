import { NextRequest } from "next/server";
import { requireAuth, authorizeRole } from "@/lib/permissions";
import { UpdateMedicalRecordSchema } from "@/validators/clinical.validator";
import { ClinicalService } from "@/services/clinical.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const record = await ClinicalService.getMedicalRecordById(id);

    return apiSuccess(record, "Medical record details retrieved", 200);
  } catch (error: any) {
    return apiError("RECORD_NOT_FOUND", error?.message || "Medical record not found", 404);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authorizeRole(req, [UserRole.DOCTOR, UserRole.SUPER_ADMIN]);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const body = await req.json();

    const validation = UpdateMedicalRecordSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid update data",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const updated = await ClinicalService.updateMedicalRecord(id, validation.data);
    return apiSuccess(updated, "Medical record updated successfully", 200);
  } catch (error: any) {
    return apiError("UPDATE_FAILED", error?.message || "Failed to update record", 500);
  }
}
