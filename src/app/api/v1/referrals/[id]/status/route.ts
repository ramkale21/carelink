import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { UpdateReferralStatusSchema } from "@/validators/worker.validator";
import { ReferralService } from "@/services/referral.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authorizeRole(req, [
      UserRole.DOCTOR,
      UserRole.HOSPITAL_ADMIN,
      UserRole.ASHA,
      UserRole.ANM,
      UserRole.CHO,
      UserRole.SUPER_ADMIN,
    ]);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const body = await req.json();

    const validation = UpdateReferralStatusSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid status transition payload",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const updated = await ReferralService.updateReferralStatus(id, validation.data.status);
    return apiSuccess(updated, "Referral status updated successfully", 200);
  } catch (error: any) {
    return apiError("UPDATE_FAILED", error?.message || "Failed to update referral status", 500);
  }
}
