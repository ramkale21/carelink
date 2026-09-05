import { NextRequest } from "next/server";
import { requireAuth, canAccessPatientData, authorizeRole } from "@/lib/permissions";
import { CreateMedicalRecordSchema } from "@/validators/clinical.validator";
import { ClinicalService } from "@/services/clinical.service";
import { UserRole } from "@prisma/client";
import { apiSuccess, apiError } from "@/lib/response";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const canAccess = await canAccessPatientData(auth.user, id);

    if (!canAccess) {
      return apiError("FORBIDDEN", "Access denied to patient medical records", 403);
    }

    const records = await ClinicalService.getPatientMedicalRecords(id);
    return apiSuccess(records, "Medical records retrieved successfully", 200);
  } catch (error: any) {
    return apiError("INTERNAL_SERVER_ERROR", error?.message || "Failed to fetch medical records", 500);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authorizeRole(req, [
      UserRole.DOCTOR,
      UserRole.HOSPITAL_ADMIN,
      UserRole.SUPER_ADMIN,
    ]);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const body = await req.json();

    const validation = CreateMedicalRecordSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid medical record data",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const record = await ClinicalService.createMedicalRecord(id, validation.data);
    return apiSuccess(record, "Medical record created successfully", 201);
  } catch (error: any) {
    return apiError("CREATE_FAILED", error?.message || "Failed to create medical record", 500);
  }
}
