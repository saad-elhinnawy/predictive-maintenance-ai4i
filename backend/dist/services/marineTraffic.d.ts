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
export interface VesselPositionData {
    lat: number;
    lng: number;
    speed: number | null;
    heading: number | null;
    timestamp: Date;
    vesselName: string | null;
    mmsi: string | null;
}
export declare const ALEXANDRIA_PORT: {
    readonly lat: 31.2001;
    readonly lng: 29.9187;
};
export declare const ALEXANDRIA_RADIUS_DEG = 0.5;
/**
 * Fetch the current position of a vessel by IMO number.
 * Returns null when no data is available (instead of throwing).
 */
export declare function fetchVesselPosition(imo: string): Promise<VesselPositionData | null>;
/**
 * Returns true when the given coordinates are within ALEXANDRIA_RADIUS_DEG
 * of Alexandria port (rough bounding-box check, suitable for ≤ 50 km precision).
 */
export declare function isNearAlexandria(lat: number, lng: number): boolean;
//# sourceMappingURL=marineTraffic.d.ts.map