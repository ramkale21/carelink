import { NextRequest } from "next/server";
import { DoctorService } from "@/services/doctor.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await DoctorService.getDoctorById(id);
    return apiSuccess(doctor, "Doctor profile retrieved successfully", 200);
  } catch (error: any) {
    return apiError("DOCTOR_NOT_FOUND", error?.message || "Doctor profile not found", 404);
  }
}
