import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { ReferralService } from "@/services/referral.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const referral = await ReferralService.getReferralById(id);

    return apiSuccess(referral, "Referral details retrieved", 200);
  } catch (error: any) {
    return apiError("REFERRAL_NOT_FOUND", error?.message || "Referral not found", 404);
  }
}
