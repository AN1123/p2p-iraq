import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { auditLog } from '../lib/audit'
import { notifyAdmins } from '../lib/telegram'
import {
  generateOrderRef,
  calcBuyTotal,
  calcSellReceive,
  ORDER_EXPIRY_MINUTES,
  MIN_ORDER_USD,
  MAX_ORDER_USD,
} from '@p2p-iraq/shared'

export const ordersRouter = Router()

// ─── Validation ───────────────────────────────────────────────────────────────
const CreateOrderSchema = z.object({
  type: z.enum(['BUY', 'SELL']),
  amountUsdt: z.number().min(MIN_ORDER_USD).max(MAX_ORDER_USD),
  network: z.enum(['TRC20', 'ERC20', 'BEP20', 'POLYGON']),
  paymentMethod: z.enum(['FIB', 'ZAINCASH', 'QICARD']),
  walletAddress: z.string().optional(),
  localAccount: z.string().optional(),
  governorate: z.string().min(2),
  telegramId: z.number(),
  telegramUsername: z.string().optional(),
})

// ─── POST /api/orders — create order ─────────────────────────────────────────
ordersRouter.post('/', async (req, res, next) => {
  try {
    const data = CreateOrderSchema.parse(req.body)

    // Get latest rate
    const rate = await prisma.rate.findFirst({ orderBy: { createdAt: 'desc' } })
    if (!rate) return res.status(503).json({ error: 'Rates unavailable' })

    const rateIqd = data.type === 'BUY'
      ? Number(rate.buyRate)
      : Number(rate.sellRate)

    // Calc amounts
    const calc = data.type === 'BUY'
      ? calcBuyTotal(data.amountUsdt, rateIqd)
      : calcSellReceive(data.amountUsdt, rateIqd)

    // Upsert user
    let user = await prisma.user.findUnique({ where: { telegramId: BigInt(data.telegramId) } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: BigInt(data.telegramId),
          telegramUsername: data.telegramUsername,
          governorate: data.governorate,
        },
      })
    }

    // Check ban
    if (user.isBanned) return res.status(403).json({ error: 'Account suspended' })

    // Generate order ref (seq from DB count)
    const count = await prisma.order.count()
    const orderRef = generateOrderRef(data.type, count + 1)

    // Create order
    const order = await prisma.order.create({
      data: {
        orderRef,
        type: data.type,
        userId: user.id,
        amountUsdt: data.amountUsdt,
        amountIqd: data.type === 'BUY' ? calc.total : calc.receive,
        network: data.network,
        paymentMethod: data.paymentMethod,
        walletAddress: data.walletAddress,
        localAccount: data.localAccount,
        governorate: data.governorate,
        commissionIqd: calc.commission,
        rateIqd,
        expiresAt: new Date(Date.now() + ORDER_EXPIRY_MINUTES * 60 * 1000),
      },
    })

    // Audit log
    await auditLog(order.id, user.id, 'ORDER_CREATED', undefined, {
      type: data.type,
      amountUsdt: data.amountUsdt,
      network: data.network,
    })

    // Notify admin group
    await notifyAdmins(order, user)

    res.status(201).json({
      orderId: order.id,
      orderRef: order.orderRef,
      amountIqd: order.amountIqd,
      commission: order.commissionIqd,
      rateIqd,
      expiresAt: order.expiresAt,
      deepLink: `https://t.me/${process.env.BOT_USERNAME}?start=${order.orderRef}`,
    })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/orders/:ref — track order ──────────────────────────────────────
ordersRouter.get('/:ref', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderRef: req.params.ref },
      select: {
        orderRef: true,
        type: true,
        amountUsdt: true,
        amountIqd: true,
        network: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        completedAt: true,
        releaseTxHash: true,
      },
    })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    next(err)
  }
})
