"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// Keep the process alive even if Prisma or a route throws an unhandled rejection
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection (process kept alive):', reason);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception (process kept alive):', err);
});
const PORT = parseInt(process.env.PORT || '4000', 10);
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '1mb' }));
// Health check registered FIRST — responds even if Prisma/DB fails to load
app.get('/api/health', (_req, res) => {
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
            Promise.resolve().then(() => __importStar(require('./routes/auth'))),
            Promise.resolve().then(() => __importStar(require('./routes/orders'))),
            Promise.resolve().then(() => __importStar(require('./routes/admin'))),
            Promise.resolve().then(() => __importStar(require('./routes/listings'))),
            Promise.resolve().then(() => __importStar(require('./routes/track'))),
            Promise.resolve().then(() => __importStar(require('./routes/contact'))),
        ]);
        app.use('/api/auth', authMod.default);
        app.use('/api/orders', ordersMod.default);
        app.use('/api/admin', adminMod.default);
        app.use('/api/listings', listingsMod.default);
        app.use('/api/track', trackMod.default);
        app.use('/api/contact', contactMod.default);
        const frontendDist = path_1.default.join(__dirname, '../../frontend/dist');
        if (fs_1.default.existsSync(frontendDist)) {
            app.use(express_1.default.static(frontendDist));
            app.get('*', (_req, res) => {
                res.sendFile(path_1.default.join(frontendDist, 'index.html'));
            });
        }
        else {
            app.use((_req, res) => {
                res.status(404).json({ error: 'Not found' });
            });
        }
        app.use((err, _req, res, _next) => {
            console.error(err);
            const message = process.env.NODE_ENV === 'production'
                ? 'Internal server error'
                : err instanceof Error ? err.message : String(err);
            res.status(500).json({ error: message });
        });
        console.log('All routes loaded successfully');
    }
    catch (e) {
        console.error('Route loading failed (server still running):', e);
    }
})();
exports.default = app;
//# sourceMappingURL=server.js.map