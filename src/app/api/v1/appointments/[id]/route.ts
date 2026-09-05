import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { name: true, phone: true, email: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        hospital: true,
        queueEvents: { orderBy: { timestamp: "asc" } },
      },
    });

    if (!appointment) {
      return apiError("APPOINTMENT_NOT_FOUND", "Appointment record not found", 404);
    }

    return apiSuccess(appointment, "Appointment details retrieved", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch appointment", 500);
  }
}
