import { logger } from './services/logger';

export function validateEnv() {
  const isProd = process.env.NODE_ENV === 'production';
  const requiredInProd = ['API_KEY', 'GEMINI_API_KEY'];

  if (isProd) {
    const missing = requiredInProd.filter((k) => !process.env[k]);
    if (missing.length > 0) {
      logger.error({ missing }, 'Missing required environment variables in production');
      // Fail fast in production
      console.error(`FATAL: Missing required env vars for production: ${missing.join(', ')}`);
      process.exit(1);
    }
  } else {
    // Development: warn but continue
    if (!process.env.API_KEY) {
      logger.warn('API_KEY not set — API key authentication will be permissive in development');
    }
    if (!process.env.GEMINI_API_KEY) {
      logger.warn('GEMINI_API_KEY not set — server will run in MOCK MODE (fallback responses)');
    }
  }

  // Optional runtime defaults
  process.env.PORT = process.env.PORT || '3000';
  process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'info';
}
