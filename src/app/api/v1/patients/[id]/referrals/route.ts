import { NextRequest } from "next/server";
import { requireAuth, canAccessPatientData } from "@/lib/permissions";
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
    const canAccess = await canAccessPatientData(auth.user, id);

    if (!canAccess) {
      return apiError("FORBIDDEN", "Access denied to patient referral history", 403);
    }

    const referrals = await ReferralService.getPatientReferrals(id);
    return apiSuccess(referrals, "Patient referrals retrieved successfully", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch referrals", 500);
  }
}
