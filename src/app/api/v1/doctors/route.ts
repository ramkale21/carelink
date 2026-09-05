import { NextRequest } from "next/server";
import { DoctorSearchSchema } from "@/validators/doctor.validator";
import { DoctorService } from "@/services/doctor.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const validation = DoctorSearchSchema.safeParse(rawParams);
    if (!validation.success) {
      return apiError(
        "INVALID_SEARCH_PARAMS",
        "Invalid query parameters",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const result = await DoctorService.searchDoctors(validation.data);
    return apiSuccess(result, "Doctors retrieved successfully", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch doctors", 500);
  }
}
