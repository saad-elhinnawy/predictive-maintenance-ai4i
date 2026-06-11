"use strict";
/**
 * MarineTraffic API client.
 *
 * Env vars required:
 *   MARINETRAFFIC_API_KEY      — your MT API key
 *   MARINETRAFFIC_BASE_URL     — defaults to https://services.marinetraffic.com/api
 *
 * The client targets MT's "Get Expected Arrivals / Vessel Positions" endpoint:
 *   GET {base}/exportvessel/v:8/{key}/vessels:{IMO}/protocol:jsono
 *
 * All network calls are wrapped with exponential-backoff retry.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALEXANDRIA_RADIUS_DEG = exports.ALEXANDRIA_PORT = void 0;
exports.fetchVesselPosition = fetchVesselPosition;
exports.isNearAlexandria = isNearAlexandria;
// ─── Configuration ──────────────────────────────────────────────────────────────
const BASE_URL = () => process.env.MARINETRAFFIC_BASE_URL?.replace(/\/$/, '') ??
    'https://services.marinetraffic.com/api';
// Alexandria, Egypt — destination port
exports.ALEXANDRIA_PORT = { lat: 31.2001, lng: 29.9187 };
exports.ALEXANDRIA_RADIUS_DEG = 0.5; // ≈ 55 km bounding box
// ─── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Retry wrapper with exponential backoff.
 * Retryable: network errors and HTTP 429 / 5xx responses.
 * Non-retryable: 4xx (except 429).
 */
async function withRetry(fn, options = {}) {
    const { maxAttempts = 3, baseDelayMs = 2000, label = 'request' } = options;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (err) {
            const isLast = attempt === maxAttempts;
            // Don't retry client errors (400–404, etc.)
            if (err instanceof MTApiError && err.status >= 400 && err.status < 500 && err.status !== 429) {
                throw err;
            }
            if (isLast) {
                console.error(`[MarineTraffic] ${label} failed after ${maxAttempts} attempts.`);
                throw err;
            }
            const delay = baseDelayMs * Math.pow(2, attempt - 1);
            console.warn(`[MarineTraffic] ${label} attempt ${attempt}/${maxAttempts} failed — ` +
                `retrying in ${delay}ms…`);
            await sleep(delay);
        }
    }
    // TypeScript requires this even though the loop always returns/throws
    throw new Error('withRetry: exhausted all attempts');
}
/** Typed API error so retry logic can inspect the status code. */
class MTApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'MTApiError';
    }
}
function parseRow(row) {
    const lat = parseFloat(row.LAT ?? '');
    const lng = parseFloat(row.LON ?? '');
    if (isNaN(lat) || isNaN(lng))
        return null;
    return {
        lat,
        lng,
        speed: row.SPEED ? parseFloat(row.SPEED) : null,
        heading: row.HEADING ? parseFloat(row.HEADING) : null,
        timestamp: row.TIMESTAMP ? new Date(row.TIMESTAMP + ' UTC') : new Date(),
        vesselName: row.VESSEL_NAME ?? null,
        mmsi: row.MMSI ?? null,
    };
}
// ─── Public API ────────────────────────────────────────────────────────────────
/**
 * Fetch the current position of a vessel by IMO number.
 * Returns null when no data is available (instead of throwing).
 */
async function fetchVesselPosition(imo) {
    const key = process.env.MARINETRAFFIC_API_KEY;
    if (!key) {
        console.warn('[MarineTraffic] MARINETRAFFIC_API_KEY not set — skipping fetch');
        return null;
    }
    const url = `${BASE_URL()}/exportvessel/v:8/${key}/vessels:${encodeURIComponent(imo)}/protocol:jsono`;
    return withRetry(async () => {
        const res = await fetch(url, {
            headers: { Accept: 'application/json' },
            signal: AbortSignal.timeout(15000),
        });
        if (!res.ok) {
            throw new MTApiError(`MarineTraffic responded with HTTP ${res.status} for IMO ${imo}`, res.status);
        }
        const body = (await res.json());
        // Handle both array format and {DATA: [...]} format
        let rows;
        if (Array.isArray(body)) {
            rows = body;
        }
        else if (body.DATA && Array.isArray(body.DATA)) {
            if (body.errors?.length) {
                console.warn('[MarineTraffic] API errors:', body.errors);
            }
            rows = body.DATA;
        }
        else {
            rows = [];
        }
        if (rows.length === 0) {
            console.info(`[MarineTraffic] No position data for IMO ${imo}`);
            return null;
        }
        return parseRow(rows[0]) ?? null;
    }, { label: `fetchVesselPosition(${imo})` });
}
/**
 * Returns true when the given coordinates are within ALEXANDRIA_RADIUS_DEG
 * of Alexandria port (rough bounding-box check, suitable for ≤ 50 km precision).
 */
function isNearAlexandria(lat, lng) {
    return (Math.abs(lat - exports.ALEXANDRIA_PORT.lat) <= exports.ALEXANDRIA_RADIUS_DEG &&
        Math.abs(lng - exports.ALEXANDRIA_PORT.lng) <= exports.ALEXANDRIA_RADIUS_DEG);
}
//# sourceMappingURL=marineTraffic.js.map