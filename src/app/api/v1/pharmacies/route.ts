import { NextRequest } from "next/server";
import { PrescriptionService } from "@/services/prescription.service";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(req: NextRequest) {
  try {
    const pharmacies = await PrescriptionService.getPharmacies();
    return apiSuccess(pharmacies, "Pharmacies retrieved successfully", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch pharmacies", 500);
  }
}
