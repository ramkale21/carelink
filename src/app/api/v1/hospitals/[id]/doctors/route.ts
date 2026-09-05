import { NextRequest } from "next/server";
import { DoctorService } from "@/services/doctor.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctors = await DoctorService.searchDoctors({ hospitalId: id });
    return apiSuccess(doctors, "Hospital doctors retrieved successfully", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch doctors", 500);
  }
}
