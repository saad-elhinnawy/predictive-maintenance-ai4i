"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Singleton to avoid exhausting the connection pool in long-running processes
const prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});
exports.default = prisma;
//# sourceMappingURL=prisma.js.map