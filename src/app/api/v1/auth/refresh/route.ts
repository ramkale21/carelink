import { NextRequest } from "next/server";
import { RefreshTokenSchema } from "@/validators/auth.validator";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = RefreshTokenSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Refresh token required",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const payload = await verifyRefreshToken(validation.data.refreshToken);
    if (!payload) {
      return apiError("INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired", 401);
    }

    const tokenPayload = {
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
      phone: payload.phone,
    };

    const newAccessToken = await signAccessToken(tokenPayload);
    const newRefreshToken = await signRefreshToken(tokenPayload);

    const response = apiSuccess(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      "Token refreshed successfully",
      200
    );

    response.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });

    return response;
  } catch {
    return apiError("INTERNAL_SERVER_ERROR", "Failed to refresh token", 500);
  }
}
