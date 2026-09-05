import prisma from "@/lib/prisma";
import { UpdatePatientProfileInput } from "@/validators/patient.validator";

export class PatientService {
  static async getPatientByUserId(userId: string) {
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
        appointments: {
          take: 5,
          orderBy: { appointmentDate: "desc" },
          include: { doctor: { include: { user: true } }, hospital: true },
        },
        referrals: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { fromHospital: true, toHospital: true },
        },
      },
    });

    if (!patientProfile) {
      throw new Error("PATIENT_NOT_FOUND: Patient profile does not exist.");
    }

    return patientProfile;
  }

  static async getPatientById(patientId: string) {
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
        medicalRecords: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        labReports: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        prescriptions: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { medicines: { include: { medicine: true } } },
        },
      },
    });

    if (!patientProfile) {
      throw new Error("PATIENT_NOT_FOUND: Patient profile does not exist.");
    }

    return patientProfile;
  }

  static async updatePatientProfile(userId: string, input: UpdatePatientProfileInput) {
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId },
    });

    if (!patientProfile) {
      throw new Error("PATIENT_NOT_FOUND: Patient profile does not exist.");
    }

    const updated = await prisma.patientProfile.update({
      where: { userId },
      data: {
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
        gender: input.gender,
        bloodGroup: input.bloodGroup,
        address: input.address,
        village: input.village,
        district: input.district,
        state: input.state,
        emergencyContact: input.emergencyContact,
        preferredLanguage: input.preferredLanguage,
        medicalHistory: input.medicalHistory !== undefined ? input.medicalHistory : undefined,
        allergies: input.allergies !== undefined ? input.allergies : undefined,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return updated;
  }
}
