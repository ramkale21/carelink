import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { MLService } from "@/services/ml.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const patientId = body.patientId || auth.user.userId;

    const result = await MLService.predictChronicRisk(patientId, body);
    return apiSuccess(result, "Chronic disease risk assessment complete", 200);
  } catch (error: any) {
    return apiError("ASSESSMENT_FAILED", error?.message || "Failed to calculate chronic disease risk", 500);
  }
}
