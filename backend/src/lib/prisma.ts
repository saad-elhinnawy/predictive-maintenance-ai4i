import { PrismaClient } from '@prisma/client';

// Singleton to avoid exhausting the connection pool in long-running processes
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export default prisma;
