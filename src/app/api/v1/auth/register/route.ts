import { NextRequest } from "next/server";
import { RegisterSchema } from "@/validators/auth.validator";
import { AuthService } from "@/services/auth.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = RegisterSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid input fields",
        400,
        validation.error.flatten().fieldErrors,
      );
    }

    const result = await AuthService.registerUser(validation.data);

    // Set HTTP-only cookie for access token
    const response = apiSuccess(result, "User registered successfully", 201);
    response.cookies.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 mins
      path: "/",
    });

    return response;
  } catch (error: any) {
    const message =
      error?.message || "An unexpected error occurred during registration";
    if (message.startsWith("PHONE_EXISTS")) {
      return apiError("PHONE_EXISTS", message, 409);
    }
    if (message.startsWith("EMAIL_EXISTS")) {
      return apiError("EMAIL_EXISTS", message, 409);
    }
    return apiError("INTERNAL_SERVER_ERROR", message, 500);
  }
}
