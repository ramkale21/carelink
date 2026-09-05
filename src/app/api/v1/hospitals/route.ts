import { NextRequest } from "next/server";
import { HospitalSearchSchema, CreateHospitalSchema } from "@/validators/hospital.validator";
import { HospitalService } from "@/services/hospital.service";
import { authorizeRole } from "@/lib/permissions";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const validation = HospitalSearchSchema.safeParse(rawParams);
    if (!validation.success) {
      return apiError(
        "INVALID_SEARCH_PARAMS",
        "Invalid query parameters",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const result = await HospitalService.searchHospitals(validation.data);
    return apiSuccess(result, "Hospitals retrieved successfully", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch hospitals", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRole(req, [UserRole.SUPER_ADMIN, UserRole.HOSPITAL_ADMIN]);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const validation = CreateHospitalSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid hospital data",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const hospital = await HospitalService.createHospital(validation.data);
    return apiSuccess(hospital, "Hospital created successfully", 201);
  } catch (error: any) {
    if (error?.message?.startsWith("HOSPITAL_EXISTS")) {
      return apiError("HOSPITAL_EXISTS", error.message, 409);
    }
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to create hospital", 500);
  }
}
