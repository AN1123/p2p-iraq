import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { ordersRouter } from './routes/orders'
import { ratesRouter } from './routes/rates'
import { adminRouter } from './routes/admin'
import { webhookRouter } from './routes/webhook'
import { errorHandler } from './middleware/errorHandler'
import { logger } from './lib/logger'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json({ limit: '10mb' }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests' },
})
app.use('/api/', limiter)

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/orders', ordersRouter)
app.use('/api/rates', ratesRouter)
app.use('/api/admin', adminRouter)
app.use('/webhook', webhookRouter)

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`API running on port ${PORT}`)
})

export default app
