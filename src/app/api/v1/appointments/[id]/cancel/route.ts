import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import { AppointmentService } from "@/services/appointment.service";
import { AppointmentStatus } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const updated = await AppointmentService.updateStatus(
      id,
      AppointmentStatus.CANCELLED,
      auth.user.userId
    );

    return apiSuccess(updated, "Appointment cancelled successfully", 200);
  } catch (error: any) {
    return apiError("CANCEL_FAILED", error?.message || "Failed to cancel appointment", 500);
  }
}
