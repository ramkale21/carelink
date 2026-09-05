import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { ClinicalService } from "@/services/clinical.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const analysis = await ClinicalService.analyzeLabReport(id);

    return apiSuccess(analysis, "Lab report analysis complete", 200);
  } catch (error: any) {
    return apiError("ANALYSIS_FAILED", error?.message || "Failed to analyze lab report", 500);
  }
}
