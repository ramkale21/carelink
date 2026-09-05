import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { CommunityPatientRegisterSchema } from "@/validators/worker.validator";
import { WorkerService } from "@/services/worker.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRole(req, [
      UserRole.ASHA,
      UserRole.ANM,
      UserRole.CHO,
      UserRole.SUPER_ADMIN,
    ]);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const validation = CommunityPatientRegisterSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid patient payload",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const patient = await WorkerService.registerCommunityPatient(
      auth.user.userId,
      validation.data
    );

    return apiSuccess(patient, "Community patient registered successfully", 201);
  } catch (error: any) {
    return apiError("REGISTRATION_FAILED", error?.message || "Failed to register patient", 500);
  }
}
