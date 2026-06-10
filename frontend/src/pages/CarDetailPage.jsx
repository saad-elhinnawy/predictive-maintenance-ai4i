import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../components/NavBar';
import { t, C, calcFinalPrice } from '../constants';

function fmtPrice(n, lang) {
  return new Intl.NumberFormat(
    lang === 'ar' ? 'ar-SA' : lang === 'de' ? 'de-DE' : 'en-US',
    { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
  ).format(n);
}

function PhotoGallery({ photos }) {
  const [active, setActive]   = useState(0);
  const [overlay, setOverlay] = useState(false);
  const stripRef = useRef(null);

  const photos_ = Array.isArray(photos) ? photos : [];

  if (photos_.length === 0) {
    return (
      <div className="cv-gallery-empty">
        <span style={{ fontSize: 64 }}>🚗</span>
      </div>
    );
  }

  return (
    <>
      <div className="cv-gallery">
        <div className="cv-gallery-main" onClick={() => setOverlay(true)} title="Click to enlarge">
          <img src={photos_[active]} alt="Vehicle" />
          <div className="cv-gallery-zoom">⤢</div>
        </div>

        {photos_.length > 1 && (
          <div className="cv-gallery-strip" ref={stripRef}>
            {photos_.map((p, i) => (
              <button
                key={i}
                className={`cv-gallery-thumb${active === i ? ' active' : ''}`}
                onClick={() => setActive(i)}
              >
                <img src={p} alt={`Photo ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {overlay && (
        <div className="cv-gallery-overlay" onClick={() => setOverlay(false)}>
          <div className="cv-gallery-overlay-inner" onClick={(e) => e.stopPropagation()}>
            <img src={photos_[active]} alt="Vehicle" />
            <div className="cv-gallery-overlay-nav">
              {photos_.length > 1 && (
                <>
                  <button onClick={() => setActive((a) => (a - 1 + photos_.length) % photos_.length)}>‹</button>
                  <span>{active + 1} / {photos_.length}</span>
                  <button onClick={() => setActive((a) => (a + 1) % photos_.length)}>›</button>
                </>
              )}
              <button style={{ marginInlineStart: 'auto' }} onClick={() => setOverlay(false)}>✕</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SpecRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="cv-spec-row">
      <span className="cv-spec-key">{label}</span>
      <span className="cv-spec-val">{value}</span>
    </div>
  );
}

export default function CarDetailPage({ listingId, lang, setLang }) {
  const tr    = t[lang];
  const isRtl = lang === 'ar';

  const [listing,  setListing]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [ordered,  setOrdered]  = useState(false);

  useEffect(() => {
    fetch(`/api/listings/${listingId}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((d) => { setListing(d); setError(null); })
      .catch((code) => setError(code === 404 ? tr.noOrder : tr.errorFetch))
      .finally(() => setLoading(false));
  }, [listingId, tr.noOrder, tr.errorFetch]);

  async function handleOrder() {
    const token = localStorage.getItem('bmw_token');
    if (!token) {
      window.location.hash = `#/login?next=${encodeURIComponent(`#/cars/${listingId}`)}`;
      return;
    }
    setOrdering(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ listingId }),
      });
      if (res.status === 401) {
        localStorage.removeItem('bmw_token');
        window.location.hash = '#/login';
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Order failed');
        return;
      }
      const data = await res.json();
      setOrdered(true);
      setTimeout(() => { window.location.hash = `#/tracking/${data.orderId}`; }, 1500);
    } catch {
      alert(tr.errorFetch);
    } finally {
      setOrdering(false);
    }
  }

  if (loading) {
    return (
      <div className="cv-page">
        <NavBar lang={lang} setLang={setLang} showBack />
        <main className="cv-main">
          <div className="cv-container">
            <div className="cv-skeleton" style={{ height: 380, borderRadius: 12, marginBottom: 24 }} />
            <div className="cv-skeleton" style={{ height: 200, borderRadius: 12 }} />
          </div>
        </main>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="cv-page">
        <NavBar lang={lang} setLang={setLang} showBack />
        <main className="cv-main">
          <div className="cv-flex-center cv-col" style={{ minHeight: 320, gap: 16, color: C.textDim }}>
            <div style={{ fontSize: 48 }}>🚗</div>
            <p>{error || tr.noOrder}</p>
            <button className="cv-btn cv-btn-ghost" onClick={() => (window.location.hash = '#/catalogue')}>
              {tr.back}
            </button>
          </div>
        </main>
      </div>
    );
  }

  const finalPrice    = calcFinalPrice(listing.basePrice, listing.shippingCost, listing.taxRate, listing.customsRate);
  const dutyAmount    = Math.round(listing.basePrice * (listing.taxRate + listing.customsRate));
  const serviceFee    = Math.round(listing.basePrice * 0.3);
  const isAvailable   = listing.status === 'AVAILABLE';
  const features      = Array.isArray(listing.features) ? listing.features : [];

  return (
    <div className="cv-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <NavBar
        lang={lang}
        setLang={setLang}
        showBack
        title={`${listing.year} ${listing.make} ${listing.model}`}
      />

      <main className="cv-main">
        <div className="cv-container cv-detail-layout">

          {/* Left: gallery */}
          <div className="cv-detail-left">
            <PhotoGallery photos={listing.photos} />

            {/* Source badge */}
            {listing.sourceSite && (
              <div className="cv-source-tag">
                {tr.sourceLabel}: <strong>{listing.sourceSite}</strong>
              </div>
            )}
          </div>

          {/* Right: info + price + CTA */}
          <div className="cv-detail-right">
            <div style={{ marginBottom: 4 }}>
              <span className={`cv-badge ${listing.condition === 'NEW' ? 'cv-badge-blue' : 'cv-badge-yellow'}`}>
                {listing.condition === 'NEW' ? tr.newCars : tr.usedCars}
              </span>
            </div>

            <h1 className="cv-h1" style={{ marginBottom: 4 }}>
              {listing.make} {listing.model}
            </h1>
            <div style={{ fontSize: 20, color: C.textMuted, marginBottom: 24 }}>{listing.year}</div>

            {/* Specs */}
            <div className="cv-section">
              <p className="cv-section-title">{tr.specs}</p>
              <div className="cv-card cv-card-sm">
                <SpecRow label={tr.fuel}      value={listing.fuelType} />
                <SpecRow label={tr.gearbox}   value={listing.transmission} />
                {listing.power && <SpecRow label={tr.power} value={`${listing.power} ${tr.hp}`} />}
                {listing.engineSize && <SpecRow label="Engine" value={`${listing.engineSize}L`} />}
                <SpecRow label={tr.mileage}   value={listing.mileage > 0 ? `${listing.mileage.toLocaleString()} ${tr.km}` : `0 ${tr.km} — New`} />
                <SpecRow label={tr.color}     value={listing.color} />
                <SpecRow label={tr.bodyType}  value={listing.bodyType} />
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="cv-section">
                <p className="cv-section-title">{tr.features}</p>
                <div className="cv-features-list">
                  {features.map((f) => (
                    <span key={f} className="cv-feature-chip">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Price breakdown */}
            <div className="cv-section">
              <p className="cv-section-title">{tr.priceBreakdown}</p>
              <div className="cv-card cv-price-card">
                <div className="cv-price-row">
                  <span>{tr.dealerPrice}</span>
                  <span>{fmtPrice(listing.basePrice, lang)}</span>
                </div>
                <div className="cv-price-row">
                  <span>{tr.shipping}</span>
                  <span>{fmtPrice(listing.shippingCost, lang)}</span>
                </div>
                <div className="cv-price-row">
                  <span>{tr.importDuties} ({Math.round((listing.taxRate + listing.customsRate) * 100)}%)</span>
                  <span>{fmtPrice(dutyAmount, lang)}</span>
                </div>
                <div className="cv-price-row">
                  <span>{tr.serviceFee}</span>
                  <span>{fmtPrice(serviceFee, lang)}</span>
                </div>
                <div className="cv-price-divider" />
                <div className="cv-price-row cv-price-total">
                  <span>{tr.finalPrice}</span>
                  <span>{fmtPrice(finalPrice, lang)}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            {isAvailable ? (
              <button
                className="cv-btn cv-btn-primary"
                style={{ width: '100%', padding: '14px 24px', fontSize: 16 }}
                onClick={handleOrder}
                disabled={ordering || ordered}
              >
                {ordered ? tr.orderSuccess : ordering ? tr.loading : tr.orderNow}
              </button>
            ) : (
              <div className="cv-sold-banner">
                <span>SOLD</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
