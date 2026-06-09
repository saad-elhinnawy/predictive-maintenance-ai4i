import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  lazy,
  Suspense,
} from 'react';
import NavBar   from '../components/NavBar';
import CarSVG   from '../components/ui/CarSVG';
import CarPhoto from '../components/ui/CarPhoto';
import { t, C, MILESTONES, ORDER_STATUS_COLOR } from '../constants';

const VesselMap = lazy(() => import('../components/VesselMap'));

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_COLOUR = '#EEEEE8'; // Alpine White

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

function milestoneLabel(m, lang) { return m[lang] ?? m.en; }

function stepState(idx, activeIdx) {
  if (idx < activeIdx)   return 'done';
  if (idx === activeIdx) return 'active';
  return 'pending';
}

function getCarColour(config) {
  if (!config) return null;
  const key = Object.keys(config).find((k) =>
    /colou?r|exterior|paint|farbe/i.test(k),
  );
  if (!key) return null;
  const val   = String(config[key] ?? '');
  const match = val.match(/#([0-9A-Fa-f]{3,6})\b/);
  return match ? match[0] : null;
}

function getPhotoUrl(config) {
  if (!config) return null;
  const key = Object.keys(config).find((k) => /photo|image|img|url/i.test(k));
  return key ? String(config[key]) : null;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StepCircle({ state, icon, num }) {
  return (
    <div className={`cv-step-circle ${state}`}>
      {state === 'done' ? '✓' : state === 'active' ? icon : num}
    </div>
  );
}

function HorizontalStepper({ milestones, activeIdx, eventsMap, lang, accentHex }) {
  return (
    <div className="cv-stepper-h">
      {milestones.map((m, i) => {
        const state = stepState(i, activeIdx);
        const ev    = eventsMap[m.key];
        return (
          <div key={m.key} className={`cv-step-h ${state}`}>
            <StepCircle state={state} icon={m.icon} num={i + 1} />
            <div
              className={`cv-step-h-label ${state}`}
              style={state === 'active' ? { color: accentHex } : undefined}
            >
              {milestoneLabel(m, lang)}
            </div>
            {ev && <div className="cv-step-h-time">{fmtDate(ev.timestamp, lang)}</div>}
          </div>
        );
      })}
    </div>
  );
}

function VerticalStepper({ milestones, activeIdx, eventsMap, lang, accentHex }) {
  return (
    <div className="cv-stepper-v">
      {milestones.map((m, i) => {
        const state  = stepState(i, activeIdx);
        const ev     = eventsMap[m.key];
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
                  color: state === 'done' ? C.success : state === 'active' ? accentHex : C.textDim,
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
                    <div className="cv-step-v-meta" style={{ marginTop: 4 }}>🚢 {ev.vesselName}</div>
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

function Preview360({ hex, photoSrc }) {
  const [open,  setOpen]  = useState(false);
  const [rotY,  setRotY]  = useState(0);
  const [modal, setModal] = useState(false);
  const dragging = useRef(false);
  const lastX    = useRef(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  function onPointerDown(e) {
    dragging.current = true;
    lastX.current    = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragging.current) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setRotY((r) => r + (x - lastX.current) * 0.4);
    lastX.current = x;
  }
  function onPointerUp() { dragging.current = false; }

  const w = isMobile ? 120 : 300;

  const rotatingCar = (
    <div
      className="cv-preview-wrap"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="cv-preview-inner" style={{ transform: `rotateY(${rotY}deg)` }}>
        <CarPhoto src={photoSrc} hex={hex} width={w} />
      </div>
    </div>
  );

  return (
    <div>
      <button
        className="cv-preview-collapse"
        onClick={() => (isMobile ? setModal(true) : setOpen((o) => !o))}
        aria-expanded={open}
      >
        <span>360° Preview — drag to rotate</span>
        {!isMobile && (
          <span className={`cv-preview-chevron ${open ? 'open' : ''}`}>▼</span>
        )}
      </button>

      {!isMobile && open && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          {rotatingCar}
        </div>
      )}

      {isMobile && modal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 8000,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 20,
          }}
          onClick={() => setModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CarPhoto src={photoSrc} hex={hex} width={Math.min(window.innerWidth - 48, 300)} />
          </div>
          <button className="cv-btn cv-btn-ghost cv-btn-sm" onClick={() => setModal(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

function SkeletonUI() {
  return (
    <div>
      <div className="cv-skeleton" style={{ height: 120, borderRadius: 12, marginBottom: 24 }} />
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
    <div className="cv-flex-center cv-col" style={{ minHeight: 320, gap: 16, color: C.textDim }}>
      <div style={{ fontSize: 48 }}>📦</div>
      <p style={{ fontSize: 15 }}>{message}</p>
      <button className="cv-btn cv-btn-ghost" onClick={() => (window.location.hash = '#/')}>
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
  const tr    = t[lang];
  const isRtl = lang === 'ar';

  const [order,       setOrder]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [toasts,      setToasts]      = useState([]);

  const token = localStorage.getItem('bmw_token');

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
      if (res.status === 404) { setError(tr.noOrder); setLoading(false); return; }
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

  useEffect(() => {
    fetchOrder();
    const iv = setInterval(fetchOrder, 30_000);
    return () => clearInterval(iv);
  }, [fetchOrder]);

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

  const carColour       = useMemo(() => getCarColour(order?.configuration) ?? DEFAULT_COLOUR, [order]);
  const photoUrl        = useMemo(() => getPhotoUrl(order?.configuration), [order]);
  const colourIsDefault = !getCarColour(order?.configuration);
  const progressPct     = activeIdx >= 0 ? Math.round(((activeIdx + 1) / MILESTONES.length) * 100) : 0;
  const isOcean         = order?.shipment?.currentMilestone === 'OCEAN_TRANSIT';

  const oceanEvent = eventsMap['OCEAN_TRANSIT'];
  const showMap    =
    isOcean && oceanEvent?.gpsLat != null && oceanEvent?.gpsLng != null;

  if (!token) return null;

  const statusClass = ORDER_STATUS_COLOR[order?.status] ?? 'cv-badge-gray';

  return (
    <div className="cv-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <NavBar lang={lang} setLang={setLang} showBack title={order ? order.carModel : tr.trackingTitle} />

      <main className="cv-main">
        <div className="cv-container">
          {loading && !order ? (
            <SkeletonUI />
          ) : error && !order ? (
            <EmptyState message={error} />
          ) : order ? (
            <>
              {/* ── Car Hero ── */}
              <div className="cv-car-hero">
                <div className="cv-car-hero-info">
                  <h1 className="cv-h1" style={{ marginBottom: 6 }}>{order.carModel}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span className="cv-text-sm cv-text-dim">
                      {tr.orderId}:{' '}
                      <code style={{ color: C.textMuted }}>{order.id.slice(0, 12)}…</code>
                    </span>
                    <span className={`cv-badge ${statusClass}`}>{order.status}</span>
                  </div>

                  <div className="cv-colour-note">
                    <div className="cv-colour-swatch" style={{ background: carColour }} title={carColour} />
                    {colourIsDefault ? 'Colour will be confirmed at purchase' : carColour}
                  </div>

                  {/* Progress bar tinted to car colour */}
                  <div className="cv-progress-track" style={{ marginTop: 14, maxWidth: 260 }}>
                    <div
                      className="cv-progress-fill"
                      style={{
                        width: `${progressPct}%`,
                        background: `linear-gradient(90deg, ${carColour}88, ${carColour})`,
                        boxShadow: `0 0 8px ${carColour}55`,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>
                    {progressPct}% complete · step {Math.max(1, activeIdx + 1)} of {MILESTONES.length}
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <button className="cv-btn cv-btn-ghost cv-btn-sm" onClick={fetchOrder} disabled={loading}>
                      ↻ {tr.refresh}
                    </button>
                  </div>
                </div>

                {/* Car SVG — drifts when at sea */}
                <div className={`cv-car-hero-visual${isOcean ? ' cv-ocean-drift' : ''}`}>
                  <CarSVG
                    hex={carColour}
                    width={typeof window !== 'undefined' && window.innerWidth < 768 ? 140 : 220}
                  />
                </div>
              </div>

              {lastFetched && (
                <div className="cv-status-bar" style={{ marginBottom: 24, marginTop: -16 }}>
                  <div className="cv-status-dot" />
                  <span>{tr.lastUpdated}: {fmtDate(lastFetched.toISOString(), lang)}</span>
                  <span>·</span>
                  <span>{tr.autoRefresh}</span>
                </div>
              )}

              {/* ── 360° Preview ── */}
              <div className="cv-section">
                <div className="cv-card cv-card-sm">
                  <Preview360 hex={carColour} photoSrc={photoUrl} />
                </div>
              </div>

              {/* ── Milestone stepper ── */}
              <div className="cv-section">
                <p className="cv-section-title">{tr.trackingTitle}</p>
                <div
                  className="cv-card"
                  style={{
                    padding: '24px 16px',
                    borderColor: isOcean ? `${carColour}44` : undefined,
                  }}
                >
                  <div className="cv-stepper-h-wrap">
                    <HorizontalStepper
                      milestones={MILESTONES}
                      activeIdx={activeIdx}
                      eventsMap={eventsMap}
                      lang={lang}
                      accentHex={carColour}
                    />
                  </div>
                  <div className="cv-stepper-v-wrap">
                    <VerticalStepper
                      milestones={MILESTONES}
                      activeIdx={activeIdx}
                      eventsMap={eventsMap}
                      lang={lang}
                      accentHex={carColour}
                    />
                  </div>

                  {/* Ocean transit inline panel */}
                  {isOcean && (
                    <div style={{
                      marginTop: 24,
                      padding: 16,
                      background: 'rgba(28,105,212,0.06)',
                      borderRadius: 10,
                      border: `1px solid ${carColour}33`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      flexWrap: 'wrap',
                    }}>
                      <div className="cv-ocean-drift">
                        <CarPhoto
                          src={photoUrl}
                          hex={carColour}
                          width={typeof window !== 'undefined' && window.innerWidth < 768 ? 110 : 170}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                          🌊 Your vehicle is at sea
                        </div>
                        {oceanEvent?.vesselName && (
                          <div className="cv-text-sm cv-text-muted">
                            Aboard {oceanEvent.vesselName}
                          </div>
                        )}
                        {oceanEvent?.gpsLat != null && (
                          <div className="cv-text-xs cv-text-dim" style={{ marginTop: 4 }}>
                            📍 {oceanEvent.gpsLat.toFixed(3)}°, {oceanEvent.gpsLng.toFixed(3)}°
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Vessel map ── */}
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
                            <div className="cv-text-xs cv-text-dim">IMO {order.shipment.vesselImo}</div>
                          )}
                        </div>
                      </div>
                    )}
                    <Suspense fallback={<div className="cv-map-container cv-skeleton" />}>
                      <VesselMap
                        lat={oceanEvent.gpsLat}
                        lng={oceanEvent.gpsLng}
                        vesselName={oceanEvent.vesselName}
                        carColour={carColour}
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
                              borderBottom:
                                i < order.shipment.trackingEvents.length - 1
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
                                    {' · '}📍 {ev.gpsLat.toFixed(3)}°, {ev.gpsLng.toFixed(3)}°
                                  </span>
                                )}
                              </div>
                              {ev.notes && <div className="cv-text-sm cv-text-muted">{ev.notes}</div>}
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
