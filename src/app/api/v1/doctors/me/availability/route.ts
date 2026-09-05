import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { UpdateDoctorAvailabilitySchema } from "@/validators/doctor.validator";
import { DoctorService } from "@/services/doctor.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const auth = await authorizeRole(req, [UserRole.DOCTOR]);
    if (auth instanceof Response) return auth;

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: auth.user.userId },
    });

    if (!doctorProfile) {
      return apiError("DOCTOR_NOT_FOUND", "Doctor profile not found", 404);
    }

    const body = await req.json();
    const validation = UpdateDoctorAvailabilitySchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid availability parameter",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const updated = await DoctorService.updateAvailability(
      doctorProfile.id,
      validation.data.isAvailable
    );
    return apiSuccess(updated, "Doctor availability updated successfully", 200);
  } catch (error: any) {
    return apiError("UPDATE_FAILED", error?.message || "Failed to update availability", 500);
  }
}
