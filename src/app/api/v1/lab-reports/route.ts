import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { UploadLabReportSchema } from "@/validators/clinical.validator";
import { ClinicalService } from "@/services/clinical.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const validation = UploadLabReportSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid lab report payload",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const report = await ClinicalService.uploadLabReport(
      auth.user.userId,
      validation.data
    );

    return apiSuccess(report, "Lab report uploaded successfully", 201);
  } catch (error: any) {
    return apiError("UPLOAD_FAILED", error?.message || "Failed to upload lab report", 500);
  }
}
