import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { CreateHealthAssessmentSchema } from "@/validators/worker.validator";
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
    const validation = CreateHealthAssessmentSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid assessment payload",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const assessment = await WorkerService.createHealthAssessment(
      auth.user.userId,
      validation.data
    );

    return apiSuccess(assessment, "Community health assessment saved", 201);
  } catch (error: any) {
    return apiError("ASSESSMENT_FAILED", error?.message || "Failed to save assessment", 500);
  }
}
