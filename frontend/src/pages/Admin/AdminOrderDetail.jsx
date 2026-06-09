import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout, { useAdminGuard } from './AdminLayout';
import { C, MILESTONES, ORDER_STATUS_COLOR } from '../../constants';

// ─── Helpers ───────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtPrice(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(n);
}

function milestoneLabel(key) {
  return MILESTONES.find((m) => m.key === key)?.en ?? key?.replace(/_/g, ' ') ?? '—';
}
function milestoneIcon(key) {
  return MILESTONES.find((m) => m.key === key)?.icon ?? '📍';
}

function stepState(eventsMap, key, activeKey) {
  const activeIdx = MILESTONES.findIndex((m) => m.key === activeKey);
  const thisIdx   = MILESTONES.findIndex((m) => m.key === key);
  if (eventsMap[key]) return 'done';
  if (key === activeKey) return 'active';
  if (thisIdx < activeIdx) return 'done';
  return 'pending';
}

// ─── Sub-components ────────────────────────────────────────

function DetailRow({ label, value, mono = false }) {
  return (
    <div>
      <div className="cv-detail-key">{label}</div>
      <div className={`cv-detail-value${mono ? '' : ''}`} style={mono ? { fontFamily: 'monospace', fontSize: 13 } : {}}>
        {value ?? '—'}
      </div>
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="cv-skeleton" style={{ height: i === 0 ? 28 : 18, width: i === 0 ? '50%' : '70%', borderRadius: 6 }} />
      ))}
    </div>
  );
}

// ─── Milestone form ────────────────────────────────────────
function MilestoneForm({ shipment, onSuccess }) {
  const [milestone,    setMilestone]    = useState(shipment.currentMilestone || 'PURCHASED');
  const [notes,        setNotes]        = useState('');
  const [gpsLat,       setGpsLat]       = useState('');
  const [gpsLng,       setGpsLng]       = useState('');
  const [vesselName,   setVesselName]   = useState('');
  const [vesselImo,    setVesselImo]    = useState(shipment.vesselImo || '');
  const [billOfLading, setBillOfLading] = useState(shipment.billOfLading || '');
  const [submitting,   setSubmitting]   = useState(false);
  const [result,       setResult]       = useState(null); // { type, message }

  // Pre-populate vessel name from latest ocean transit event
  useEffect(() => {
    const oceanEv = shipment.trackingEvents?.find((e) => e.milestone === 'OCEAN_TRANSIT');
    if (oceanEv?.vesselName) setVesselName(oceanEv.vesselName);
  }, [shipment.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const token = localStorage.getItem('bmw_token');
    const body = {
      milestone,
      ...(notes        && { notes }),
      ...(vesselImo    && { vesselImo }),
      ...(billOfLading && { billOfLading }),
      ...(vesselName   && { vesselName }),
      ...(gpsLat !== '' && !isNaN(parseFloat(gpsLat)) && { gpsLat: parseFloat(gpsLat) }),
      ...(gpsLng !== '' && !isNaN(parseFloat(gpsLng)) && { gpsLng: parseFloat(gpsLng) }),
    };

    try {
      const res = await fetch(`/api/admin/shipments/${shipment.id}/milestone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setResult({ type: 'error', message: err.error || 'Update failed. Please try again.' });
        return;
      }

      setResult({ type: 'success', message: `Milestone updated to "${milestoneLabel(milestone)}".` });
      setNotes('');
      setGpsLat('');
      setGpsLng('');
      onSuccess();
    } catch {
      setResult({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cv-milestone-form">
      {/* Milestone dropdown */}
      <div className="cv-form-group">
        <label className="cv-label">Milestone *</label>
        <select className="cv-input" value={milestone} onChange={(e) => setMilestone(e.target.value)} required>
          {MILESTONES.map((m) => (
            <option key={m.key} value={m.key}>
              {m.icon}  {m.en}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div className="cv-form-group">
        <label className="cv-label">Notes (optional)</label>
        <textarea
          className="cv-input"
          placeholder="Location, context, carrier note…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
        />
      </div>

      {/* GPS coords */}
      <div>
        <label className="cv-label" style={{ marginBottom: 6, display: 'block' }}>GPS Position (optional)</label>
        <div className="cv-form-row">
          <div className="cv-form-group">
            <input
              className="cv-input"
              type="number"
              step="any"
              min="-90"
              max="90"
              placeholder="Latitude (e.g. 53.55)"
              value={gpsLat}
              onChange={(e) => setGpsLat(e.target.value)}
            />
          </div>
          <div className="cv-form-group">
            <input
              className="cv-input"
              type="number"
              step="any"
              min="-180"
              max="180"
              placeholder="Longitude (e.g. 9.99)"
              value={gpsLng}
              onChange={(e) => setGpsLng(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Vessel details */}
      <div className="cv-form-row">
        <div className="cv-form-group">
          <label className="cv-label">Vessel Name</label>
          <input
            className="cv-input"
            type="text"
            placeholder="e.g. MAERSK ELBA"
            value={vesselName}
            onChange={(e) => setVesselName(e.target.value)}
            maxLength={200}
          />
        </div>
        <div className="cv-form-group">
          <label className="cv-label">Vessel IMO</label>
          <input
            className="cv-input"
            type="text"
            placeholder="e.g. 9299860"
            value={vesselImo}
            onChange={(e) => setVesselImo(e.target.value)}
            maxLength={20}
          />
        </div>
      </div>

      {/* Bill of Lading */}
      <div className="cv-form-group">
        <label className="cv-label">Bill of Lading</label>
        <input
          className="cv-input"
          type="text"
          placeholder="e.g. MAEU123456789"
          value={billOfLading}
          onChange={(e) => setBillOfLading(e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Result feedback */}
      {result && (
        <div className={`cv-alert cv-alert-${result.type}`}>
          <span className="cv-alert-icon">{result.type === 'success' ? '✓' : '✕'}</span>
          {result.message}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="cv-btn cv-btn-ghost"
          onClick={() => { setNotes(''); setGpsLat(''); setGpsLng(''); setResult(null); }}
          disabled={submitting}
        >
          Reset
        </button>
        <button type="submit" className="cv-btn cv-btn-primary" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update Milestone →'}
        </button>
      </div>
    </form>
  );
}

// ─── Create shipment inline form ────────────────────────────
function CreateShipmentForm({ orderId, onCreated }) {
  const [bol,      setBol]      = useState('');
  const [imo,      setImo]      = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleCreate() {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('bmw_token');
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/shipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ billOfLading: bol || undefined, vesselImo: imo || undefined }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || 'Failed to create shipment.');
        return;
      }
      onCreated();
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
      <div className="cv-form-row">
        <div className="cv-form-group">
          <label className="cv-label">Bill of Lading (optional)</label>
          <input className="cv-input" type="text" placeholder="MAEU…" value={bol} onChange={(e) => setBol(e.target.value)} />
        </div>
        <div className="cv-form-group">
          <label className="cv-label">Vessel IMO (optional)</label>
          <input className="cv-input" type="text" placeholder="9299860" value={imo} onChange={(e) => setImo(e.target.value)} />
        </div>
      </div>
      {error && <div className="cv-alert cv-alert-error"><span className="cv-alert-icon">✕</span>{error}</div>}
      <button className="cv-btn cv-btn-primary" onClick={handleCreate} disabled={loading}>
        {loading ? 'Creating…' : '⚓ Initialize Shipment'}
      </button>
    </div>
  );
}

// ─── Tracking timeline ──────────────────────────────────────
function TrackingTimeline({ events, activeKey }) {
  if (!events?.length) {
    return <p style={{ color: C.textDim, fontSize: 13, fontStyle: 'italic' }}>No events recorded yet.</p>;
  }

  const eventsMap = events.reduce((acc, ev) => { acc[ev.milestone] = ev; return acc; }, {});

  return (
    <div className="cv-timeline">
      {[...events]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map((ev, i) => {
          const state = stepState(eventsMap, ev.milestone, activeKey);
          const isLast = i === events.length - 1;
          return (
            <div key={ev.id} className="cv-timeline-item">
              <div className="cv-timeline-left">
                <div className={`cv-timeline-dot ${state}`} />
                {!isLast && <div className={`cv-timeline-line${state === 'done' ? ' done' : ''}`} />}
              </div>
              <div className="cv-timeline-body">
                <div className="cv-timeline-title">
                  <span>{milestoneIcon(ev.milestone)}</span>
                  <span style={{ color: state === 'done' ? C.success : state === 'active' ? C.accent : C.textMuted }}>
                    {milestoneLabel(ev.milestone)}
                  </span>
                  {ev.milestone === activeKey && (
                    <span className="cv-badge cv-badge-blue" style={{ fontSize: 9 }}>CURRENT</span>
                  )}
                </div>
                <div className="cv-timeline-meta">
                  {fmtDate(ev.timestamp)}
                  {ev.vesselName && <span> · 🚢 {ev.vesselName}</span>}
                  {ev.gpsLat != null && (
                    <span> · 📍 {ev.gpsLat.toFixed(3)}°, {ev.gpsLng.toFixed(3)}°</span>
                  )}
                </div>
                {ev.notes && <div className="cv-timeline-notes">{ev.notes}</div>}
              </div>
            </div>
          );
        })}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────
export default function AdminOrderDetail({ orderId, lang, setLang }) {
  const isAdmin = useAdminGuard();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchOrder = useCallback(async () => {
    const token = localStorage.getItem('bmw_token');
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { window.location.hash = '#/login'; return; }
      if (res.status === 404) { setError('Order not found.'); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrder(data);
      setError(null);
    } catch {
      setError('Failed to load order.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  if (!isAdmin) return null;

  const statusClass = ORDER_STATUS_COLOR[order?.status] ?? 'cv-badge-gray';

  return (
    <AdminLayout lang={lang} setLang={setLang}>
      {/* Back + header */}
      <div className="cv-admin-page-header">
        <div>
          <button
            className="cv-btn cv-btn-ghost cv-btn-sm"
            onClick={() => window.location.hash = '#/admin'}
            style={{ marginBottom: 10 }}
          >
            ← All Orders
          </button>
          {loading ? (
            <div className="cv-skeleton" style={{ height: 28, width: 260, borderRadius: 6 }} />
          ) : (
            <>
              <div className="cv-admin-page-title">
                {order?.carModel ?? 'Order Detail'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                <span className="cv-table-mono" style={{ fontSize: 12 }}>{orderId}</span>
                {order?.status && <span className={`cv-badge ${statusClass}`}>{order.status}</span>}
              </div>
            </>
          )}
        </div>
        <button className="cv-btn cv-btn-ghost cv-btn-sm" onClick={fetchOrder} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="cv-alert cv-alert-error cv-mb-24">
          <span className="cv-alert-icon">✕</span>
          {error}
        </div>
      )}

      {loading && !order ? (
        <SkeletonDetail />
      ) : order ? (
        <div className="cv-admin-detail-grid">
          {/* ─ Left column: info + timeline ─ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Order info */}
            <div className="cv-card">
              <p className="cv-section-title">Order Details</p>
              <div className="cv-detail-grid" style={{ marginBottom: 16 }}>
                <DetailRow label="Customer Name"  value={order.user?.name} />
                <DetailRow label="Customer Email" value={order.user?.email} />
                <DetailRow label="Total Price"    value={fmtPrice(order.totalPrice)} />
                <DetailRow label="Order Status"   value={<span className={`cv-badge ${statusClass}`}>{order.status}</span>} />
                <DetailRow label="Created"        value={fmtDate(order.createdAt)} />
                {order.shipment?.billOfLading && (
                  <DetailRow label="Bill of Lading" value={order.shipment.billOfLading} mono />
                )}
                {order.shipment?.vesselImo && (
                  <DetailRow label="Vessel IMO" value={order.shipment.vesselImo} mono />
                )}
              </div>

              {/* Configuration */}
              {order.configuration && Object.keys(order.configuration).length > 0 && (
                <>
                  <div className="cv-divider" />
                  <p className="cv-section-title">Configuration</p>
                  <div className="cv-detail-grid">
                    {Object.entries(order.configuration).map(([key, val]) => (
                      <DetailRow
                        key={key}
                        label={key}
                        value={Array.isArray(val) ? val.join(', ') : String(val)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Tracking timeline */}
            <div className="cv-card">
              <p className="cv-section-title">Tracking Timeline</p>
              <TrackingTimeline
                events={order.shipment?.trackingEvents}
                activeKey={order.shipment?.currentMilestone}
              />
            </div>
          </div>

          {/* ─ Right column: milestone form ─ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {order.shipment ? (
              <>
                {/* Current milestone summary */}
                <div className="cv-card cv-card-sm">
                  <p className="cv-section-title">Current Status</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 24 }}>{milestoneIcon(order.shipment.currentMilestone)}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>
                        {milestoneLabel(order.shipment.currentMilestone)}
                      </div>
                      {order.shipment.trackingEvents?.[0] && (
                        <div className="cv-text-xs cv-text-dim">
                          {fmtDate(order.shipment.trackingEvents[0].timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* MarineTraffic error flag — shown when flag is present */}
                {order.shipment?.marineTrafficError && (
                  <div className="cv-alert cv-alert-warning">
                    <span className="cv-alert-icon">⚠️</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>MarineTraffic sync failed</div>
                      <div style={{ fontSize: 12 }}>
                        IMO {order.shipment.vesselImo} — vessel position could not be retrieved.
                      </div>
                    </div>
                    <button
                      className="cv-btn cv-btn-sm"
                      style={{ background: C.warningBg, color: C.warning, border: `1px solid ${C.warning}44`, flexShrink: 0 }}
                      onClick={() => alert('MarineTraffic sync — integration not yet configured.')}
                    >
                      ↻ Retry sync
                    </button>
                  </div>
                )}

                {/* Milestone update form */}
                <div className="cv-card">
                  <p className="cv-section-title">Update Milestone</p>
                  <MilestoneForm shipment={order.shipment} onSuccess={fetchOrder} />
                </div>
              </>
            ) : (
              /* No shipment yet */
              <div className="cv-create-shipment-banner">
                <div style={{ fontSize: 32, marginBottom: 10 }}>⚓</div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>No shipment record</div>
                <p className="cv-text-sm cv-text-muted" style={{ marginBottom: 14 }}>
                  Initialize a shipment to start tracking milestones for this order.
                </p>
                {showCreateForm ? (
                  <CreateShipmentForm
                    orderId={orderId}
                    onCreated={() => { setShowCreateForm(false); fetchOrder(); }}
                  />
                ) : (
                  <button
                    className="cv-btn cv-btn-primary"
                    onClick={() => setShowCreateForm(true)}
                  >
                    ⚓ Create Shipment
                  </button>
                )}
              </div>
            )}

            {/* Customer link */}
            <div className="cv-card cv-card-sm" style={{ textAlign: 'center' }}>
              <p className="cv-text-sm cv-text-muted" style={{ marginBottom: 10 }}>
                View as customer
              </p>
              <button
                className="cv-btn cv-btn-ghost cv-btn-sm cv-w-full"
                onClick={() => window.location.hash = `#/tracking/${orderId}`}
              >
                → Customer Tracking View
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
