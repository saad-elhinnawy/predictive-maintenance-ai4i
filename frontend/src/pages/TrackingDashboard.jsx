import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from 'react';
import NavBar from '../components/NavBar';
import { t, C, MILESTONES, ORDER_STATUS_COLOR } from '../constants';

// Leaflet map loaded lazily so it doesn't block the initial render
const VesselMap = lazy(() => import('../components/VesselMap'));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso, lang) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(
    lang === 'ar' ? 'ar-SA' : lang === 'de' ? 'de-DE' : 'en-US',
    { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  );
}

function fmtPrice(n, lang) {
  return new Intl.NumberFormat(
    lang === 'ar' ? 'ar-SA' : lang === 'de' ? 'de-DE' : 'en-US',
    { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
  ).format(n);
}

function milestoneLabel(m, lang) {
  return m[lang] ?? m.en;
}

function stepState(idx, activeIdx) {
  if (idx < activeIdx)  return 'done';
  if (idx === activeIdx) return 'active';
  return 'pending';
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StepCircle({ state, icon, num }) {
  return (
    <div className={`cv-step-circle ${state}`}>
      {state === 'done' ? '✓' : state === 'active' ? icon : num}
    </div>
  );
}

function HorizontalStepper({ milestones, activeIdx, eventsMap, lang }) {
  return (
    <div className="cv-stepper-h">
      {milestones.map((m, i) => {
        const state = stepState(i, activeIdx);
        const ev = eventsMap[m.key];
        return (
          <div key={m.key} className={`cv-step-h ${state}`}>
            <StepCircle state={state} icon={m.icon} num={i + 1} />
            <div className={`cv-step-h-label ${state}`}>{milestoneLabel(m, lang)}</div>
            {ev && (
              <div className="cv-step-h-time">{fmtDate(ev.timestamp, lang)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function VerticalStepper({ milestones, activeIdx, eventsMap, lang }) {
  return (
    <div className="cv-stepper-v">
      {milestones.map((m, i) => {
        const state = stepState(i, activeIdx);
        const ev = eventsMap[m.key];
        const isLast = i === milestones.length - 1;
        return (
          <div key={m.key} className="cv-step-v">
            <div className="cv-step-v-col">
              <StepCircle state={state} icon={m.icon} num={i + 1} />
              {!isLast && <div className={`cv-step-v-line ${state === 'done' ? 'done' : ''}`} />}
            </div>
            <div className="cv-step-v-body">
              <div className="cv-step-v-title">
                <span style={{
                  color: state === 'done'
                    ? C.success
                    : state === 'active'
                    ? C.accent
                    : C.textDim,
                }}>
                  {milestoneLabel(m, lang)}
                </span>
                {state === 'active' && (
                  <span className="cv-badge cv-badge-blue" style={{ fontSize: 9 }}>NOW</span>
                )}
              </div>
              {ev ? (
                <>
                  <div className="cv-step-v-meta">{fmtDate(ev.timestamp, lang)}</div>
                  {ev.notes && <div className="cv-step-v-notes">{ev.notes}</div>}
                  {ev.vesselName && (
                    <div className="cv-step-v-meta" style={{ marginTop: 4 }}>
                      🚢 {ev.vesselName}
                    </div>
                  )}
                </>
              ) : (
                <div className="cv-step-v-meta" style={{ fontStyle: 'italic' }}>—</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkeletonUI() {
  return (
    <div>
      <div className="cv-card cv-mb-24">
        <div className="cv-skeleton" style={{ height: 22, width: '40%', marginBottom: 12 }} />
        <div className="cv-skeleton" style={{ height: 14, width: '25%' }} />
      </div>
      <div className="cv-card cv-mb-24">
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div className="cv-skeleton" style={{ width: 32, height: 32, borderRadius: '50%' }} />
              <div className="cv-skeleton" style={{ height: 10, width: '80%' }} />
            </div>
          ))}
        </div>
      </div>
      <div className="cv-card">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div className="cv-skeleton" style={{ height: 14, width: '60%', marginBottom: 6 }} />
            <div className="cv-skeleton" style={{ height: 12, width: '40%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div
      className="cv-flex-center cv-col"
      style={{ minHeight: 320, gap: 16, color: C.textDim }}
    >
      <div style={{ fontSize: 48 }}>📦</div>
      <p style={{ fontSize: 15 }}>{message}</p>
      <button
        className="cv-btn cv-btn-ghost"
        onClick={() => (window.location.hash = '#/')}
      >
        ← Go back
      </button>
    </div>
  );
}

function ToastContainer({ toasts }) {
  return (
    <div className="cv-toast-container">
      {toasts.map(({ id, message, type }) => (
        <div key={id} className={`cv-toast cv-toast-${type}`}>
          <span>{type === 'error' ? '✕' : type === 'success' ? '✓' : 'ℹ'}</span>
          <span>{message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TrackingDashboard({ orderId, lang, setLang }) {
  const tr = t[lang];
  const isRtl = lang === 'ar';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [toasts, setToasts] = useState([]);

  const token = localStorage.getItem('bmw_token');

  // Redirect if unauthenticated
  useEffect(() => {
    if (!token) {
      window.location.hash = `#/login?next=${encodeURIComponent(`#/tracking/${orderId}`)}`;
    }
  }, [token, orderId]);

  const addToast = useCallback((message, type = 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 5000);
  }, []);

  const fetchOrder = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('bmw_token');
        localStorage.removeItem('bmw_user');
        window.location.hash = '#/login';
        return;
      }
      if (res.status === 404) {
        setError(tr.noOrder);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setOrder(data);
      setError(null);
      setLastFetched(new Date());
    } catch {
      addToast(tr.errorFetch, 'error');
      if (!order) setError(tr.errorFetch);
    } finally {
      setLoading(false);
    }
  }, [orderId, token, tr, order, addToast]);

  // Initial fetch + 30 s polling
  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 30_000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  // Build a key → trackingEvent map (keep most recent per milestone)
  const eventsMap = useMemo(() => {
    if (!order?.shipment?.trackingEvents?.length) return {};
    return order.shipment.trackingEvents.reduce((acc, ev) => {
      const existing = acc[ev.milestone];
      if (!existing || new Date(ev.timestamp) > new Date(existing.timestamp)) {
        acc[ev.milestone] = ev;
      }
      return acc;
    }, {});
  }, [order]);

  const activeIdx = useMemo(() => {
    const cur = order?.shipment?.currentMilestone;
    if (!cur) return -1;
    return MILESTONES.findIndex((m) => m.key === cur);
  }, [order]);

  // Find the ocean event with GPS for the map
  const oceanEvent = eventsMap['OCEAN_TRANSIT'];
  const showMap =
    order?.shipment?.currentMilestone === 'OCEAN_TRANSIT' &&
    oceanEvent?.gpsLat != null &&
    oceanEvent?.gpsLng != null;

  if (!token) return null;

  const statusClass = ORDER_STATUS_COLOR[order?.status] ?? 'cv-badge-gray';

  return (
    <div className="cv-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <NavBar
        lang={lang}
        setLang={setLang}
        showBack
        title={order ? order.carModel : tr.trackingTitle}
      />

      <main className="cv-main">
        <div className="cv-container">
          {loading && !order ? (
            <SkeletonUI />
          ) : error && !order ? (
            <EmptyState message={error} />
          ) : order ? (
            <>
              {/* ── Order header ── */}
              <div className="cv-section">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h1 className="cv-h1" style={{ marginBottom: 6 }}>{order.carModel}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span className="cv-text-sm cv-text-dim">
                        {tr.orderId}: <code style={{ color: C.textMuted }}>{order.id.slice(0, 12)}…</code>
                      </span>
                      <span className={`cv-badge ${statusClass}`}>{order.status}</span>
                    </div>
                  </div>
                  <button
                    className="cv-btn cv-btn-ghost cv-btn-sm"
                    onClick={fetchOrder}
                    disabled={loading}
                    aria-label={tr.refresh}
                  >
                    ↻ {tr.refresh}
                  </button>
                </div>

                {lastFetched && (
                  <div className="cv-status-bar" style={{ marginTop: 12 }}>
                    <div className="cv-status-dot" />
                    <span>{tr.lastUpdated}: {fmtDate(lastFetched.toISOString(), lang)}</span>
                    <span>·</span>
                    <span>{tr.autoRefresh}</span>
                  </div>
                )}
              </div>

              {/* ── Stepper ── */}
              <div className="cv-section">
                <p className="cv-section-title">{tr.trackingTitle}</p>
                <div className="cv-card" style={{ padding: '24px 16px' }}>
                  {/* Horizontal (desktop) */}
                  <div className="cv-stepper-h-wrap">
                    <HorizontalStepper
                      milestones={MILESTONES}
                      activeIdx={activeIdx}
                      eventsMap={eventsMap}
                      lang={lang}
                    />
                  </div>
                  {/* Vertical (mobile) */}
                  <div className="cv-stepper-v-wrap">
                    <VerticalStepper
                      milestones={MILESTONES}
                      activeIdx={activeIdx}
                      eventsMap={eventsMap}
                      lang={lang}
                    />
                  </div>
                </div>
              </div>

              {/* ── Vessel map (Ocean Transit only) ── */}
              {showMap && (
                <div className="cv-section">
                  <p className="cv-section-title">{tr.vesselPosition}</p>
                  <div className="cv-card cv-card-sm">
                    {oceanEvent.vesselName && (
                      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 20 }}>🚢</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{oceanEvent.vesselName}</div>
                          {order.shipment.vesselImo && (
                            <div className="cv-text-xs cv-text-dim">
                              IMO {order.shipment.vesselImo}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <Suspense
                      fallback={
                        <div className="cv-map-container cv-skeleton" />
                      }
                    >
                      <VesselMap
                        lat={oceanEvent.gpsLat}
                        lng={oceanEvent.gpsLng}
                        vesselName={oceanEvent.vesselName}
                      />
                    </Suspense>
                  </div>
                </div>
              )}

              {/* ── Order details ── */}
              <div className="cv-section">
                <p className="cv-section-title">{tr.configuration}</p>
                <div className="cv-card">
                  <div className="cv-detail-grid">
                    <div>
                      <div className="cv-detail-key">{tr.model}</div>
                      <div className="cv-detail-value">{order.carModel}</div>
                    </div>
                    <div>
                      <div className="cv-detail-key">{tr.totalPrice}</div>
                      <div className="cv-detail-value">{fmtPrice(order.totalPrice, lang)}</div>
                    </div>
                    <div>
                      <div className="cv-detail-key">{tr.status}</div>
                      <div className="cv-detail-value">
                        <span className={`cv-badge ${statusClass}`}>{order.status}</span>
                      </div>
                    </div>
                    {order.shipment?.billOfLading && (
                      <div>
                        <div className="cv-detail-key">{tr.billOfLading}</div>
                        <div className="cv-detail-value" style={{ fontFamily: 'monospace', fontSize: 13 }}>
                          {order.shipment.billOfLading}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Configuration JSON */}
                  {order.configuration && Object.keys(order.configuration).length > 0 && (
                    <>
                      <div className="cv-divider" />
                      <div className="cv-detail-grid">
                        {Object.entries(order.configuration).map(([key, val]) => (
                          <div key={key}>
                            <div className="cv-detail-key">{key}</div>
                            <div className="cv-detail-value" style={{ fontSize: 13 }}>
                              {Array.isArray(val) ? val.join(', ') : String(val)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── Tracking event log ── */}
              {order.shipment?.trackingEvents?.length > 0 && (
                <div className="cv-section">
                  <p className="cv-section-title">{tr.milestone}</p>
                  <div className="cv-card cv-card-sm" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[...order.shipment.trackingEvents]
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .map((ev, i) => {
                        const m = MILESTONES.find((x) => x.key === ev.milestone);
                        return (
                          <div
                            key={ev.id}
                            style={{
                              padding: '14px 0',
                              borderBottom: i < order.shipment.trackingEvents.length - 1
                                ? '1px solid var(--cv-border-light)'
                                : 'none',
                              display: 'flex',
                              gap: 12,
                              alignItems: 'flex-start',
                            }}
                          >
                            <span style={{ fontSize: 18, marginTop: 1, flexShrink: 0 }}>
                              {m?.icon ?? '📍'}
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>
                                {m ? milestoneLabel(m, lang) : ev.milestone}
                              </div>
                              <div className="cv-text-xs cv-text-dim" style={{ marginBottom: ev.notes ? 6 : 0 }}>
                                {fmtDate(ev.timestamp, lang)}
                                {ev.vesselName && ` · 🚢 ${ev.vesselName}`}
                                {ev.gpsLat != null && (
                                  <span>
                                    {' · '}
                                    📍 {ev.gpsLat.toFixed(3)}°, {ev.gpsLng.toFixed(3)}°
                                  </span>
                                )}
                              </div>
                              {ev.notes && (
                                <div className="cv-text-sm cv-text-muted">{ev.notes}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {!order.shipment && (
                <div className="cv-card" style={{ textAlign: 'center', padding: 40, color: C.textDim }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
                  <p>{tr.noEvents}</p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
