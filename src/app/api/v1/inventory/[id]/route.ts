import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { UpdateInventorySchema } from "@/validators/clinical.validator";
import { PrescriptionService } from "@/services/prescription.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authorizeRole(req, [
      UserRole.PHARMACIST,
      UserRole.HOSPITAL_ADMIN,
      UserRole.SUPER_ADMIN,
    ]);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const body = await req.json();

    const validation = UpdateInventorySchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid inventory update payload",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const updated = await PrescriptionService.updateInventory(id, validation.data);
    return apiSuccess(updated, "Inventory item updated successfully", 200);
  } catch (error: any) {
    return apiError("UPDATE_FAILED", error?.message || "Failed to update inventory item", 500);
  }
}
