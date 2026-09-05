import { NextRequest } from "next/server";
import { CreateAppointmentSchema } from "@/validators/appointment.validator";
import { AppointmentService } from "@/services/appointment.service";
import { requireAuth } from "@/lib/permissions";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const idempotencyKey = req.headers.get("idempotency-key") || undefined;
    const body = await req.json();

    const validation = CreateAppointmentSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid appointment payload",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const appointment = await AppointmentService.bookAppointment(
      validation.data,
      idempotencyKey
    );

    return apiSuccess(appointment, "Appointment booked successfully", 201);
  } catch (error: any) {
    if (error?.message?.startsWith("SLOT_UNAVAILABLE")) {
      return apiError("SLOT_UNAVAILABLE", error.message, 409);
    }
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to book appointment", 500);
  }
}
