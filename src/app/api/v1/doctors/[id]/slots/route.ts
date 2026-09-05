import { NextRequest } from "next/server";
import { QuerySlotsSchema } from "@/validators/appointment.validator";
import { AppointmentService } from "@/services/appointment.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    const validation = QuerySlotsSchema.safeParse({ date });
    if (!validation.success) {
      return apiError(
        "INVALID_DATE_FORMAT",
        "Query date must be formatted YYYY-MM-DD",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const result = await AppointmentService.getAvailableSlots(id, date);
    return apiSuccess(result, "Available slots retrieved successfully", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to calculate slots", 500);
  }
}
