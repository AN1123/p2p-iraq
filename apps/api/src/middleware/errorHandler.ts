import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { logger } from '../lib/logger'

export function errorHandler(err: any, req: Request, res: Response, _: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation error', details: err.errors })
  }
  logger.error(err.message, { stack: err.stack, path: req.path })
  res.status(500).json({ error: 'Internal server error' })
}
