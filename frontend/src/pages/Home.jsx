import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Silhouette from '../components/Silhouette';
import { t, C, ORDER_STATUS_COLOR } from '../constants';

function fmtPrice(n, lang) {
  return new Intl.NumberFormat(
    lang === 'ar' ? 'ar-SA' : lang === 'de' ? 'de-DE' : 'en-US',
    { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
  ).format(n);
}

export default function Home({ lang, setLang }) {
  const tr = t[lang];
  const isRtl = lang === 'ar';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bmw_token');
    if (!token) {
      window.location.hash = '#/login';
      return;
    }
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem('bmw_token');
          window.location.hash = '#/login';
          return null;
        }
        return r.json();
      })
      .then((data) => data && setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="cv-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <NavBar lang={lang} setLang={setLang} />

      {/* Hero band */}
      <div style={{
        background: 'linear-gradient(160deg, #0D1830 0%, #111827 60%, #0A0F1E 100%)',
        borderBottom: '1px solid var(--cv-border)',
        padding: '40px 0 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(28,105,212,.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <Silhouette
          width={360}
          opacity={0.07}
          style={{ position: 'absolute', bottom: 0, right: 0, pointerEvents: 'none' }}
        />
        <div className="cv-container" style={{ position: 'relative' }}>
          <h1 className="cv-h1" style={{ marginBottom: 8 }}>{tr.yourOrders}</h1>
          <p className="cv-text-sm cv-text-muted">{tr.trackingTitle}</p>
        </div>
      </div>

      <main className="cv-main">
        <div className="cv-container">
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="cv-skeleton" style={{ height: 80, borderRadius: 12 }} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div
              className="cv-flex-center cv-col"
              style={{ minHeight: 280, gap: 16, color: C.textDim }}
            >
              <div style={{ fontSize: 48 }}>🚗</div>
              <p style={{ fontSize: 15 }}>{tr.noOrders}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.map((order) => {
                const statusClass = ORDER_STATUS_COLOR[order.status] ?? 'cv-badge-gray';
                return (
                  <div
                    key={order.id}
                    className="cv-order-card"
                    onClick={() => (window.location.hash = `#/tracking/${order.id}`)}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && (window.location.hash = `#/tracking/${order.id}`)
                    }
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{order.carModel}</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span className={`cv-badge ${statusClass}`}>{order.status}</span>
                          {order.shipment?.currentMilestone && (
                            <span className="cv-text-xs cv-text-dim">
                              📍 {order.shipment.currentMilestone.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontWeight: 600, color: C.accent, marginBottom: 4 }}>
                          {fmtPrice(order.totalPrice, lang)}
                        </div>
                        <button className="cv-btn cv-btn-primary cv-btn-sm">
                          {tr.trackShipment} →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
