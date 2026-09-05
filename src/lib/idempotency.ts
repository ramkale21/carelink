import prisma from "@/lib/prisma";

export async function checkIdempotencyKey(key: string) {
  if (!key) return null;

  const existingAppointment = await prisma.appointment.findUnique({
    where: { idempotencyKey: key },
    include: {
      patient: { include: { user: { select: { name: true, phone: true } } } },
      doctor: { include: { user: { select: { name: true } } } },
      hospital: { select: { name: true } },
    },
  });

  return existingAppointment;
}
