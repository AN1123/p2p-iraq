import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { requireAdmin } from '../middleware/auth'

export const ratesRouter = Router()

// GET /api/rates — public, get current rate
ratesRouter.get('/', async (_, res, next) => {
  try {
    const rate = await prisma.rate.findFirst({ orderBy: { createdAt: 'desc' } })
    if (!rate) return res.status(503).json({ error: 'Rates not set yet' })
    res.json({
      buyRate: Number(rate.buyRate),
      sellRate: Number(rate.sellRate),
      spread: Number(rate.buyRate) - Number(rate.sellRate),
      updatedAt: rate.createdAt,
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/rates — admin only, update rate
ratesRouter.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { buyRate, sellRate } = z.object({
      buyRate: z.number().min(1000).max(10000),
      sellRate: z.number().min(1000).max(10000),
    }).parse(req.body)

    if (sellRate >= buyRate) {
      return res.status(400).json({ error: 'sellRate must be less than buyRate' })
    }

    const rate = await prisma.rate.create({
      data: { buyRate, sellRate, setBy: req.adminId },
    })
    res.json({ message: 'Rate updated', rate })
  } catch (err) {
    next(err)
  }
})
