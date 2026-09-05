import { NextRequest } from "next/server";
import { AppointmentService } from "@/services/appointment.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || undefined;

    const result = await AppointmentService.getHospitalQueue(id, date);
    return apiSuccess(result, "Hospital queue state retrieved successfully", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch queue", 500);
  }
}
