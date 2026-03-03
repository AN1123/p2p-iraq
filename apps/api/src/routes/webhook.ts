import { Router } from 'express'

export const webhookRouter = Router()

// Telegram webhook — handled by the bot app
// This stub exists for documentation; actual webhook is in apps/bot
webhookRouter.post('/telegram', (req, res) => {
  res.json({ ok: true })
})
