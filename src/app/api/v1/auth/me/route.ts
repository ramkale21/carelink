import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { AuthService } from "@/services/auth.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth(req);
    if (authResult instanceof Response) return authResult;

    const user = await AuthService.getMe(authResult.user.userId);
    return apiSuccess(user, "User profile retrieved successfully", 200);
  } catch (error: any) {
    return apiError(
      "USER_NOT_FOUND",
      error?.message || "Failed to retrieve user profile",
      404
    );
  }
}
