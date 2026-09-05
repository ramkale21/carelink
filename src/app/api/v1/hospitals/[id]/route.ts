import { NextRequest } from "next/server";
import { HospitalService } from "@/services/hospital.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hospital = await HospitalService.getHospitalById(id);
    return apiSuccess(hospital, "Hospital details retrieved successfully", 200);
  } catch (error: any) {
    return apiError("HOSPITAL_NOT_FOUND", error?.message || "Hospital not found", 404);
  }
}
