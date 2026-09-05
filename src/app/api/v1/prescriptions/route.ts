import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { CreatePrescriptionSchema } from "@/validators/clinical.validator";
import { PrescriptionService } from "@/services/prescription.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function POST(req: NextRequest) {
  try {
    const auth = await authorizeRole(req, [UserRole.DOCTOR, UserRole.SUPER_ADMIN]);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const validation = CreatePrescriptionSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid prescription payload",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const rx = await PrescriptionService.createPrescription(validation.data);
    return apiSuccess(rx, "Prescription created successfully", 201);
  } catch (error: any) {
    return apiError("CREATE_FAILED", error?.message || "Failed to create prescription", 500);
  }
}
