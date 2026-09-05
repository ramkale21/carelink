import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { ClinicalService } from "@/services/clinical.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const report = await ClinicalService.getLabReportById(id);

    return apiSuccess(report, "Lab report details retrieved", 200);
  } catch (error: any) {
    return apiError("LAB_REPORT_NOT_FOUND", error?.message || "Lab report not found", 404);
  }
}
