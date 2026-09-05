import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { AppointmentService } from "@/services/appointment.service";
import { AppointmentStatus, UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authorizeRole(req, [UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN, UserRole.SUPER_ADMIN]);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const updated = await AppointmentService.updateStatus(
      id,
      AppointmentStatus.COMPLETED,
      auth.user.userId
    );

    return apiSuccess(updated, "Consultation completed successfully", 200);
  } catch (error: any) {
    return apiError("COMPLETE_FAILED", error?.message || "Failed to complete consultation", 500);
  }
}
