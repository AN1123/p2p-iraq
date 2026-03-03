import { prisma } from './prisma'

export async function auditLog(
  orderId: string | undefined,
  userId: string | undefined,
  action: string,
  performedBy: string | undefined,
  details: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: { orderId, userId, action, performedBy, details },
  })
}
