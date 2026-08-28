import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

export function applySecurity(app: any) {
  // Helmet for basic security headers
  app.use(helmet());

  // CORS
  const raw = process.env.ALLOWED_ORIGINS || "";
  const allowed = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const isProd = process.env.NODE_ENV === "production";

  const corsOptions: cors.CorsOptions = isProd
    ? {
        origin: (origin, callback) => {
          if (!origin) return callback(null, true); // allow non-browser (curl, server-to-server)
          if (allowed.includes(origin)) return callback(null, true);
          return callback(new Error("Not allowed by CORS"));
        },
      }
    : { origin: true }; // permissive in dev

  app.use(cors(corsOptions));

  // Rate limiting
  const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 1);
  const max = Number(process.env.RATE_LIMIT_MAX || 60);

  const limiter = rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });

  // Apply rate limit to all /api routes
  app.use('/api/', limiter);
}
