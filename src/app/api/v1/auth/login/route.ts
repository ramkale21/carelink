import { NextRequest } from "next/server";
import { LoginSchema } from "@/validators/auth.validator";
import { AuthService } from "@/services/auth.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid login input",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const result = await AuthService.loginUser(validation.data);

    const response = apiSuccess(result, "Login successful", 200);
    response.cookies.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 mins
      path: "/",
    });

    return response;
  } catch (error: any) {
    const message = error?.message || "An unexpected error occurred during login";
    if (message.startsWith("INVALID_CREDENTIALS")) {
      return apiError("INVALID_CREDENTIALS", "Invalid phone number/email or password", 401);
    }
    if (message.startsWith("ACCOUNT_DISABLED")) {
      return apiError("ACCOUNT_DISABLED", message, 403);
    }
    return apiError("INTERNAL_SERVER_ERROR", message, 500);
  }
}
