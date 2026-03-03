import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAdmin } from '../middleware/auth'
import { auditLog } from '../lib/audit'
import { notifyUser } from '../lib/telegram'

export const adminRouter = Router()
adminRouter.use(requireAdmin)

// GET /api/admin/orders — list pending orders
adminRouter.get('/orders', async (req, res, next) => {
  try {
    const { status = 'proof_submitted' } = req.query
    const orders = await prisma.order.findMany({
      where: { status: String(status) },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    })
    res.json(orders)
  } catch (err) { next(err) }
})

// POST /api/admin/orders/:id/approve — approve proof
adminRouter.post('/orders/:id/approve', async (req, res, next) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'processing', assignedAdminId: req.adminId },
    })
    await auditLog(order.id, undefined, 'PROOF_APPROVED', req.adminId, {})
    await notifyUser(order, '✅ تم التحقق من الدفع! جاري إرسال الـ USDT...')
    res.json({ message: 'Approved', order })
  } catch (err) { next(err) }
})

// POST /api/admin/orders/:id/reject — reject proof
adminRouter.post('/orders/:id/reject', async (req, res, next) => {
  try {
    const { reason } = z.object({ reason: z.string() }).parse(req.body)
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'proof_submitted', notes: reason },
    })
    await auditLog(order.id, undefined, 'PROOF_REJECTED', req.adminId, { reason })
    await notifyUser(order, `❌ تم رفض إثبات الدفع\nالسبب: ${reason}\n\nيرجى إرسال إثبات أوضح.`)
    res.json({ message: 'Rejected' })
  } catch (err) { next(err) }
})

// POST /api/admin/orders/:id/complete — mark complete + add tx hash
adminRouter.post('/orders/:id/complete', async (req, res, next) => {
  try {
    const { txHash } = z.object({ txHash: z.string() }).parse(req.body)
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'completed', releaseTxHash: txHash, completedAt: new Date() },
    })
    await auditLog(order.id, undefined, 'ORDER_COMPLETED', req.adminId, { txHash })
    await notifyUser(order,
      `🎉 تمت الصفقة!\nتم إرسال ${order.amountUsdt} USDT\n🔍 التتبع: https://tronscan.org/#/transaction/${txHash}`)
    res.json({ message: 'Completed' })
  } catch (err) { next(err) }
})

// POST /api/admin/orders/:id/freeze
adminRouter.post('/orders/:id/freeze', async (req, res, next) => {
  try {
    const { reason } = z.object({ reason: z.string() }).parse(req.body)
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'frozen', notes: reason },
    })
    await auditLog(order.id, undefined, 'ORDER_FROZEN', req.adminId, { reason })
    await notifyUser(order, `❄️ تم تجميد طلبك مؤقتاً. سيتواصل معك مشرفنا خلال ساعة.`)
    res.json({ message: 'Frozen' })
  } catch (err) { next(err) }
})
