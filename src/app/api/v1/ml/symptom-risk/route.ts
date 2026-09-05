import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { MLService } from "@/services/ml.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    if (!body.symptoms || !Array.isArray(body.symptoms)) {
      return apiError("VALIDATION_ERROR", "Symptoms array is required", 400);
    }

    const patientId = body.patientId || auth.user.userId;
    const prediction = await MLService.predictSymptomRisk(patientId, body);

    return apiSuccess(prediction, "Symptom risk prediction calculated", 200);
  } catch (error: any) {
    return apiError("PREDICTION_FAILED", error?.message || "Failed to calculate symptom risk", 500);
  }
}
