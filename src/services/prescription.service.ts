import prisma from "@/lib/prisma";
import { CreatePrescriptionInput, AddInventoryInput, UpdateInventoryInput } from "@/validators/clinical.validator";

export class PrescriptionService {
  static async createPrescription(input: CreatePrescriptionInput) {
    const prescription = await prisma.$transaction(async (tx) => {
      const rx = await tx.prescription.create({
        data: {
          patientId: input.patientId,
          doctorId: input.doctorId,
          appointmentId: input.appointmentId || null,
          instructions: input.instructions || null,
        },
      });

      await tx.prescriptionMedicine.createMany({
        data: input.medicines.map((m) => ({
          prescriptionId: rx.id,
          medicineId: m.medicineId,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions || null,
        })),
      });

      // Fetch created prescription with details
      const created = await tx.prescription.findUnique({
        where: { id: rx.id },
        include: {
          doctor: { include: { user: { select: { name: true } } } },
          medicines: { include: { medicine: true } },
        },
      });

      return created;
    });

    return prescription;
  }

  static async getPrescriptionById(id: string) {
    const rx = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: { include: { user: { select: { name: true } } } },
        doctor: { include: { user: { select: { name: true } }, hospital: { select: { name: true } } } },
        medicines: { include: { medicine: true } },
      },
    });

    if (!rx) {
      throw new Error("PRESCRIPTION_NOT_FOUND: Prescription record does not exist.");
    }

    return rx;
  }

  static async getPatientPrescriptions(patientId: string) {
    return prisma.prescription.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
      include: {
        doctor: { include: { user: { select: { name: true } }, hospital: { select: { name: true } } } },
        medicines: { include: { medicine: true } },
      },
    });
  }

  static async dispensePrescription(prescriptionId: string, pharmacyId: string) {
    const rx = await this.getPrescriptionById(prescriptionId);

    // Deduct quantity from inventory in transaction
    const result = await prisma.$transaction(async (tx) => {
      for (const item of rx.medicines) {
        const inventory = await tx.pharmacyInventory.findFirst({
          where: { pharmacyId, medicineId: item.medicineId },
        });

        if (inventory && inventory.quantity > 0) {
          await tx.pharmacyInventory.update({
            where: { id: inventory.id },
            data: { quantity: { decrement: 1 } },
          });
        }
      }

      await tx.auditLog.create({
        data: {
          action: "PRESCRIPTION_DISPENSED",
          entity: "Prescription",
          entityId: prescriptionId,
          metadata: { pharmacyId },
        },
      });

      return { prescriptionId, pharmacyId, status: "DISPENSED" };
    });

    return result;
  }

  static async getPharmacies() {
    return prisma.pharmacy.findMany({
      include: {
        hospital: { select: { name: true, district: true } },
        _count: { select: { inventories: true } },
      },
    });
  }

  static async getPharmacyInventory(pharmacyId: string) {
    return prisma.pharmacyInventory.findMany({
      where: { pharmacyId },
      include: { medicine: true },
      orderBy: { expiryDate: "asc" },
    });
  }

  static async addInventory(pharmacyId: string, input: AddInventoryInput) {
    return prisma.pharmacyInventory.create({
      data: {
        pharmacyId,
        medicineId: input.medicineId,
        quantity: input.quantity,
        batchNumber: input.batchNumber,
        expiryDate: new Date(input.expiryDate),
        price: input.price,
      },
      include: { medicine: true },
    });
  }

  static async updateInventory(id: string, input: UpdateInventoryInput) {
    return prisma.pharmacyInventory.update({
      where: { id },
      data: {
        quantity: input.quantity !== undefined ? input.quantity : undefined,
        price: input.price !== undefined ? input.price : undefined,
      },
      include: { medicine: true },
    });
  }
}
