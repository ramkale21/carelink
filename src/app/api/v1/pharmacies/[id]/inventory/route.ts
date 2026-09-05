import { NextRequest } from "next/server";
import { authorizeRole } from "@/lib/permissions";
import { AddInventorySchema } from "@/validators/clinical.validator";
import { PrescriptionService } from "@/services/prescription.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inventory = await PrescriptionService.getPharmacyInventory(id);
    return apiSuccess(inventory, "Pharmacy inventory retrieved", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch inventory", 500);
  }
}

export async function POST(
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

    const validation = AddInventorySchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid inventory payload",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const item = await PrescriptionService.addInventory(id, validation.data);
    return apiSuccess(item, "Inventory item added successfully", 201);
  } catch (error: any) {
    return apiError("ADD_FAILED", error?.message || "Failed to add inventory item", 500);
  }
}
