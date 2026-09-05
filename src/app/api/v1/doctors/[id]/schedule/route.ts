import { NextRequest } from "next/server";
import { DoctorScheduleSchema } from "@/validators/doctor.validator";
import { DoctorService } from "@/services/doctor.service";
import { authorizeRole } from "@/lib/permissions";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";
import { z } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const schedule = await DoctorService.getDoctorSchedule(id);
    return apiSuccess(schedule, "Doctor schedule retrieved successfully", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch schedule", 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authorizeRole(req, [
      UserRole.DOCTOR,
      UserRole.HOSPITAL_ADMIN,
      UserRole.SUPER_ADMIN,
    ]);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const body = await req.json();

    const validation = z.array(DoctorScheduleSchema).safeParse(body);
    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid schedule format",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const updated = await DoctorService.setDoctorSchedule(id, validation.data);
    return apiSuccess(updated, "Doctor schedule updated successfully", 200);
  } catch (error: any) {
    return apiError("SCHEDULE_UPDATE_FAILED", error?.message || "Failed to update schedule", 500);
  }
}
