import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes     from './routes/auth';
import ordersRoutes   from './routes/orders';
import adminRoutes    from './routes/admin';
import listingsRoutes from './routes/listings';
import trackRoutes    from './routes/track';
import contactRoutes  from './routes/contact';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.use('/api/auth',     authRoutes);
app.use('/api/orders',   ordersRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/track',    trackRoutes);
app.use('/api/contact',  contactRoutes);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

const PORT = parseInt(process.env.PORT || '4000', 10);
app.listen(PORT, () => {
  console.log(`EuroDriveEgypt API running on port ${PORT} [${process.env.NODE_ENV ?? 'development'}]`);
});

export default app;
