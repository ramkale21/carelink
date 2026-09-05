import prisma from "@/lib/prisma";
import {
  CreateMedicalRecordInput,
  UpdateMedicalRecordInput,
  UploadLabReportInput,
} from "@/validators/clinical.validator";

export class ClinicalService {
  static async createMedicalRecord(patientId: string, input: CreateMedicalRecordInput) {
    const record = await prisma.medicalRecord.create({
      data: {
        patientId,
        doctorId: input.doctorId,
        hospitalId: input.hospitalId,
        recordType: input.recordType,
        diagnosis: input.diagnosis,
        notes: input.notes || null,
        treatment: input.treatment || null,
      },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        hospital: { select: { name: true } },
      },
    });

    return record;
  }

  static async getPatientMedicalRecords(patientId: string) {
    return prisma.medicalRecord.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
      include: {
        doctor: { include: { user: { select: { name: true } } } },
        hospital: { select: { name: true } },
      },
    });
  }

  static async getMedicalRecordById(id: string) {
    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { name: true } } } },
        doctor: { include: { user: { select: { name: true } } } },
        hospital: { select: { name: true } },
      },
    });

    if (!record) {
      throw new Error("RECORD_NOT_FOUND: Medical record does not exist.");
    }

    return record;
  }

  static async updateMedicalRecord(id: string, input: UpdateMedicalRecordInput) {
    return prisma.medicalRecord.update({
      where: { id },
      data: {
        diagnosis: input.diagnosis,
        notes: input.notes,
        treatment: input.treatment,
      },
    });
  }

  static async uploadLabReport(uploaderUserId: string, input: UploadLabReportInput) {
    const report = await prisma.$transaction(async (tx) => {
      const labReport = await tx.labReport.create({
        data: {
          patientId: input.patientId,
          hospitalId: input.hospitalId,
          uploadedBy: uploaderUserId,
          fileUrl: input.fileUrl,
          reportType: input.reportType,
          extractedText: input.extractedText || null,
          status: "UPLOADED",
        },
      });

      if (input.results && input.results.length > 0) {
        await tx.labResult.createMany({
          data: input.results.map((r) => ({
            labReportId: labReport.id,
            parameter: r.parameter,
            value: r.value,
            unit: r.unit || null,
            referenceRange: r.referenceRange || null,
            abnormalFlag: r.abnormalFlag,
          })),
        });
      }

      return labReport;
    });

    return report;
  }

  static async getLabReportById(id: string) {
    const report = await prisma.labReport.findUnique({
      where: { id },
      include: {
        results: true,
        patient: { include: { user: { select: { name: true } } } },
        hospital: { select: { name: true } },
      },
    });

    if (!report) {
      throw new Error("LAB_REPORT_NOT_FOUND: Lab report does not exist.");
    }

    return report;
  }

  static async analyzeLabReport(id: string) {
    const report = await this.getLabReportById(id);

    // Flag abnormal parameters automatically based on text or results
    const abnormalResults = report.results.filter((r) => r.abnormalFlag);
    const isAbnormal = abnormalResults.length > 0;

    const updated = await prisma.labReport.update({
      where: { id },
      data: {
        status: "ANALYZED",
      },
      include: { results: true },
    });

    return {
      reportId: id,
      status: "ANALYZED",
      abnormalCount: abnormalResults.length,
      abnormalParameters: abnormalResults,
      summary: isAbnormal
        ? `Attention: ${abnormalResults.length} abnormal parameters detected in ${report.reportType}.`
        : `Lab report parameters are within normal reference ranges.`,
      updatedReport: updated,
    };
  }
}
