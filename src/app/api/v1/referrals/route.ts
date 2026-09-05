import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { CreateReferralSchema } from "@/validators/worker.validator";
import { ReferralService } from "@/services/referral.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const validation = CreateReferralSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid referral payload",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const referral = await ReferralService.createReferral(validation.data);
    return apiSuccess(referral, "Digital referral created successfully", 201);
  } catch (error: any) {
    return apiError("CREATE_FAILED", error?.message || "Failed to create referral", 500);
  }
}
