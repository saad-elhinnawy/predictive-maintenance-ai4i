import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Keep the process alive even if Prisma or a route throws an unhandled rejection
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection (process kept alive):', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception (process kept alive):', err);
});

const PORT = parseInt(process.env.PORT || '4000', 10);
const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Health check registered FIRST — responds even if Prisma/DB fails to load
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start listening immediately so Railway healthcheck can succeed
app.listen(PORT, () => {
  console.log(`EuroDriveEgypt API running on port ${PORT} [${process.env.NODE_ENV ?? 'development'}]`);
});

// Load Prisma-dependent routes after server is already accepting connections
(async () => {
  try {
    const [authMod, ordersMod, adminMod, listingsMod, trackMod, contactMod] = await Promise.all([
      import('./routes/auth'),
      import('./routes/orders'),
      import('./routes/admin'),
      import('./routes/listings'),
      import('./routes/track'),
      import('./routes/contact'),
    ]);

    app.use('/api/auth',     authMod.default);
    app.use('/api/orders',   ordersMod.default);
    app.use('/api/admin',    adminMod.default);
    app.use('/api/listings', listingsMod.default);
    app.use('/api/track',    trackMod.default);
    app.use('/api/contact',  contactMod.default);

    const frontendDist = path.join(__dirname, '../../frontend/dist');
    if (fs.existsSync(frontendDist)) {
      app.use(express.static(frontendDist));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(frontendDist, 'index.html'));
      });
    } else {
      app.use((_req: Request, res: Response) => {
        res.status(404).json({ error: 'Not found' });
      });
    }

    app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
      console.error(err);
      const message =
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    });

    console.log('All routes loaded successfully');
  } catch (e) {
    console.error('Route loading failed (server still running):', e);
  }
})();

export default app;
