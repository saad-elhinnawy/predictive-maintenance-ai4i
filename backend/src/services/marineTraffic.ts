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

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface VesselPositionData {
  lat:        number;
  lng:        number;
  speed:      number | null;
  heading:    number | null;
  timestamp:  Date;
  vesselName: string | null;
  mmsi:       string | null;
}

/** Raw row returned by MarineTraffic jsono protocol */
interface MTVesselRow {
  MMSI?:        string;
  IMO?:         string;
  VESSEL_NAME?: string;
  LAT?:         string;
  LON?:         string;
  SPEED?:       string;
  HEADING?:     string;
  COURSE?:      string;
  TIMESTAMP?:   string;  // "YYYY-MM-DD HH:mm" UTC
}

interface MTResponse {
  DATA?: MTVesselRow[];
  errors?: { code: string; description: string }[];
}

// ─── Configuration ──────────────────────────────────────────────────────────────

const BASE_URL = () =>
  process.env.MARINETRAFFIC_BASE_URL?.replace(/\/$/, '') ??
  'https://services.marinetraffic.com/api';

// Alexandria, Egypt — destination port
export const ALEXANDRIA_PORT = { lat: 31.2001, lng: 29.9187 } as const;
export const ALEXANDRIA_RADIUS_DEG = 0.5; // ≈ 55 km bounding box

// ─── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry wrapper with exponential backoff.
 * Retryable: network errors and HTTP 429 / 5xx responses.
 * Non-retryable: 4xx (except 429).
 */
async function withRetry<T>(
  fn:      () => Promise<T>,
  options: { maxAttempts?: number; baseDelayMs?: number; label?: string } = {},
): Promise<T> {
  const { maxAttempts = 3, baseDelayMs = 2_000, label = 'request' } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
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
      console.warn(
        `[MarineTraffic] ${label} attempt ${attempt}/${maxAttempts} failed — ` +
        `retrying in ${delay}ms…`,
      );
      await sleep(delay);
    }
  }

  // TypeScript requires this even though the loop always returns/throws
  throw new Error('withRetry: exhausted all attempts');
}

/** Typed API error so retry logic can inspect the status code. */
class MTApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'MTApiError';
  }
}

function parseRow(row: MTVesselRow): VesselPositionData | null {
  const lat = parseFloat(row.LAT ?? '');
  const lng = parseFloat(row.LON ?? '');

  if (isNaN(lat) || isNaN(lng)) return null;

  return {
    lat,
    lng,
    speed:      row.SPEED  ? parseFloat(row.SPEED)  : null,
    heading:    row.HEADING ? parseFloat(row.HEADING) : null,
    timestamp:  row.TIMESTAMP ? new Date(row.TIMESTAMP + ' UTC') : new Date(),
    vesselName: row.VESSEL_NAME ?? null,
    mmsi:       row.MMSI ?? null,
  };
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch the current position of a vessel by IMO number.
 * Returns null when no data is available (instead of throwing).
 */
export async function fetchVesselPosition(imo: string): Promise<VesselPositionData | null> {
  const key = process.env.MARINETRAFFIC_API_KEY;

  if (!key) {
    console.warn('[MarineTraffic] MARINETRAFFIC_API_KEY not set — skipping fetch');
    return null;
  }

  const url = `${BASE_URL()}/exportvessel/v:8/${key}/vessels:${encodeURIComponent(imo)}/protocol:jsono`;

  return withRetry(
    async () => {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal:  AbortSignal.timeout(15_000),
      });

      if (!res.ok) {
        throw new MTApiError(
          `MarineTraffic responded with HTTP ${res.status} for IMO ${imo}`,
          res.status,
        );
      }

      const body = (await res.json()) as MTResponse | MTVesselRow[];

      // Handle both array format and {DATA: [...]} format
      let rows: MTVesselRow[];
      if (Array.isArray(body)) {
        rows = body as MTVesselRow[];
      } else if (body.DATA && Array.isArray(body.DATA)) {
        if (body.errors?.length) {
          console.warn('[MarineTraffic] API errors:', body.errors);
        }
        rows = body.DATA;
      } else {
        rows = [];
      }

      if (rows.length === 0) {
        console.info(`[MarineTraffic] No position data for IMO ${imo}`);
        return null;
      }

      return parseRow(rows[0]) ?? null;
    },
    { label: `fetchVesselPosition(${imo})` },
  );
}

/**
 * Returns true when the given coordinates are within ALEXANDRIA_RADIUS_DEG
 * of Alexandria port (rough bounding-box check, suitable for ≤ 50 km precision).
 */
export function isNearAlexandria(lat: number, lng: number): boolean {
  return (
    Math.abs(lat - ALEXANDRIA_PORT.lat) <= ALEXANDRIA_RADIUS_DEG &&
    Math.abs(lng - ALEXANDRIA_PORT.lng) <= ALEXANDRIA_RADIUS_DEG
  );
}
