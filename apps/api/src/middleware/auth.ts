import { Request, Response, NextFunction } from 'express'

declare global {
  namespace Express {
    interface Request { adminId?: string }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-admin-token']
  if (!token || token !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  req.adminId = 'admin' // TODO: map to actual admin user ID
  next()
}
