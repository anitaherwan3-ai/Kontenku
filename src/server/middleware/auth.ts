import { Request, Response, NextFunction } from 'express';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const publicPaths = ['/api/health'];
  // allow health check without API key
  if (req.method === 'GET' && publicPaths.includes(req.path)) return next();

  const configured = process.env.API_KEY;
  if (!configured) {
    console.warn('API_KEY not configured — skipping API key authentication (DEV ONLY)');
    return next();
  }

  const header = (req.headers['x-api-key'] || (req.headers.authorization && String(req.headers.authorization).replace(/^Bearer\s+/i, ''))) as string | undefined;
  if (!header || header !== configured) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid API key' });
  }
  next();
}
