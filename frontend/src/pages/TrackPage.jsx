import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { TRACK_STEPS, MILESTONE_STEP_INDEX, fmtPrice, fmtDate } from '../constants/index.js';

function stepClass(idx, currentIdx) {
  if (idx < currentIdx)  return 'ed-prog-step done';
  if (idx === currentIdx) return 'ed-prog-step active';
  return 'ed-prog-step';
}

const STEP_ICONS = ['📋', '🚛', '⚓', '🚢', '🏖️', '✅'];

function TrackResult({ data }) {
  const milestone  = data.shipment?.currentMilestone ?? 'PURCHASED';
  const currentIdx = MILESTONE_STEP_INDEX[milestone] ?? 0;
  const events     = data.shipment?.trackingEvents ?? [];
  const isDelivered = data.status === 'DELIVERED';

  return (
    <>
      {/* Order Status */}
      <div className="ed-card ed-status-card">
        <div className="ed-status-header">
          <div>
            <div className="ed-h3">Order Status</div>
            <div className="ed-status-id">Tracking: {data.id}</div>
          </div>
          <div className={`ed-status-badge ${isDelivered ? 'delivered' : ''}`}>
            {isDelivered ? 'DELIVERED' : 'IN TRANSIT'}
          </div>
        </div>
        <div className="ed-progress-steps">
          {TRACK_STEPS.map((s, i) => (
            <div className={stepClass(i, currentIdx)} key={s.key}>
              <div className="ed-prog-circle">
                {i <= currentIdx ? '✓' : STEP_ICONS[i]}
              </div>
              <div className="ed-prog-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vessel Information */}
      {data.shipment && (
        <div className="ed-card ed-vessel-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span>🚢</span>
            <span className="ed-h3">Vessel Information</span>
          </div>
          <div className="ed-vessel-grid">
            <div>
              <div className="ed-vessel-field-label">Vessel Name</div>
              <div className="ed-vessel-field-val">{data.shipment.billOfLading || '—'}</div>
            </div>
            <div>
              <div className="ed-vessel-field-label">Bill of Lading</div>
              <div className="ed-vessel-field-val">{data.shipment.billOfLading || '—'}</div>
            </div>
            <div>
              <div className="ed-vessel-field-label">Port of Loading</div>
              <div className="ed-vessel-field-val">Hamburg, Germany</div>
            </div>
            <div>
              <div className="ed-vessel-field-label">Port of Discharge</div>
              <div className="ed-vessel-field-val">Alexandria, Egypt</div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking History */}
      {events.length > 0 && (
        <div className="ed-card ed-vessel-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span>🕐</span>
            <span className="ed-h3">Tracking History</span>
          </div>
          <div className="ed-timeline">
            {events.map((ev, i) => (
              <div className="ed-timeline-item" key={i}>
                <div className="ed-tl-dot">🚢</div>
                <div>
                  <div className="ed-tl-title">{ev.notes || ev.milestone}</div>
                  <div className="ed-tl-meta">
                    {fmtDate(ev.timestamp)}
                    {ev.vesselName ? ` · ${ev.vesselName}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="ed-card ed-summary-card">
        <div className="ed-h3" style={{ marginBottom: 12 }}>Order Summary</div>
        <div className="ed-summary-row">
          <span className="ed-summary-key">Vehicle</span>
          <span className="ed-summary-val">{data.carModel}</span>
        </div>
        <div className="ed-summary-row">
          <span className="ed-summary-key">Total Price</span>
          <span className="ed-summary-val total">{fmtPrice(data.totalPrice)}</span>
        </div>
        <div style={{ marginTop: 16 }}>
          <button
            className="ed-btn ed-btn-outline ed-btn-full"
            onClick={() => { window.location.hash = '#/track'; }}
          >
            Track Another Order
          </button>
        </div>
      </div>
    </>
  );
}

const INFO_CARDS = [
  {
    icon: '📍',
    title: 'What You Can Track',
    items: [
      'Real-time vessel position and speed',
      'Estimated arrival time',
      'Port of loading and discharge',
      'Complete event history',
    ],
  },
  {
    icon: '🚢',
    title: 'MarineTraffic Integration',
    body: 'We use MarineTraffic data to provide accurate, real-time vessel tracking. View your vehicle\'s journey from Hamburg to Alexandria with satellite-backed GPS data.',
  },
];

export default function TrackPage({ orderId }) {
  const [input, setInput]   = useState(orderId || '');
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    if (orderId) fetchOrder(orderId);
  }, [orderId]);

  async function fetchOrder(id) {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const r = await fetch(`/api/track/${id.trim()}`);
      if (!r.ok) { setError('Order not found. Please check your tracking number.'); setData(null); return; }
      setData(await r.json());
    } catch {
      setError('Failed to load tracking data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleTrack(e) {
    e.preventDefault();
    if (!input.trim()) return;
    window.location.hash = `#/track/${input.trim()}`;
  }

  return (
    <div className="ed-page">
      <TopBar />
      <NavBar />
      <main className="ed-main">
        <div className="ed-page-header">
          <div className="ed-container">
            <h1 className="ed-h1">Track Your Order</h1>
            <p className="ed-lead" style={{ marginTop: 8 }}>
              Monitor your vehicle shipment in real-time. From Germany to Alexandria with complete visibility.
            </p>
          </div>
        </div>

        {/* Track input */}
        <div className="ed-card ed-track-form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span>📍</span>
            <span className="ed-h3">Track Your Order</span>
          </div>
          <form onSubmit={handleTrack}>
            <div className="ed-track-input-row">
              <input
                className="ed-input"
                placeholder="Enter tracking number (e.g., cm123abc456…)"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" className="ed-btn ed-btn-primary" disabled={loading}>
                {loading ? '…' : 'Track'}
              </button>
            </div>
          </form>
          <p className="ed-track-hint">Demo: Enter any order ID to see sample tracking data</p>
        </div>

        {error && (
          <div style={{ margin: '0 20px', padding: 16, background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 12, color: '#991B1B', fontSize: 14 }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--ed-text-muted)' }}>
            Loading tracking data…
          </div>
        )}

        {data && <TrackResult data={data} />}

        {/* Info cards */}
        <div className="ed-info-cards" style={{ marginTop: 24 }}>
          {INFO_CARDS.map(card => (
            <div className="ed-card" key={card.title}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span>{card.icon}</span>
                <span className="ed-h3">{card.title}</span>
              </div>
              {card.items ? (
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {card.items.map(it => (
                    <li key={it} style={{ fontSize: 14, color: 'var(--ed-text-muted)' }}>{it}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: 14, color: 'var(--ed-text-muted)', lineHeight: 1.6 }}>{card.body}</p>
              )}
            </div>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  );
}
