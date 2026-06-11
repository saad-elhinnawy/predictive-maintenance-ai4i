import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import { calcFinalPrice, fmtPrice, hasColorVariants, getPhotoUrl } from '../constants/index.js';

const FUEL_LABELS = { PETROL: 'Petrol', DIESEL: 'Diesel', HYBRID: 'Hybrid', ELECTRIC: 'Electric' };

function PhotoGallery({ urls }) {
  const [idx, setIdx] = useState(0);

  if (!urls || urls.length === 0) return (
    <div className="ed-detail-gallery" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ed-bg-soft)' }}>
      <Icon name="car" size={64} style={{ color: 'var(--ed-text-light)' }} />
    </div>
  );

  const prev = () => setIdx(i => (i - 1 + urls.length) % urls.length);
  const next = () => setIdx(i => (i + 1) % urls.length);

  return (
    <div className="ed-detail-gallery">
      <img className="ed-gallery-img" src={urls[idx]} alt={`Photo ${idx + 1}`} />
      {urls.length > 1 && (
        <>
          <button className="ed-gallery-nav ed-gallery-prev" onClick={prev}>‹</button>
          <button className="ed-gallery-nav ed-gallery-next" onClick={next}>›</button>
          <div className="ed-gallery-dots">
            {urls.map((_, i) => (
              <button key={i} className={`ed-gallery-dot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ColorSelector({ photos, activeColor, onSelect }) {
  if (!hasColorVariants(photos)) return null;
  return (
    <div className="ed-detail-color-selector">
      <div className="ed-detail-color-label">
        Colour: <strong>{photos[activeColor]?.color}</strong>
      </div>
      <div className="ed-color-dots" style={{ marginTop: 8 }}>
        {photos.map((v, i) => (
          <button
            key={i}
            className={`ed-color-dot${activeColor === i ? ' active' : ''}`}
            style={{ background: v.hex, width: 28, height: 28 }}
            title={v.color}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
}

function SpecRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="ed-spec-row">
      <span className="ed-spec-key">{label}</span>
      <span className="ed-spec-val">{value}</span>
    </div>
  );
}

function OrderForm({ listing }) {
  const [form, setForm]       = useState({ customerName: '', customerEmail: '', customerPhone: '' });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState(false);

  function onChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const r = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id, ...form }),
      });
      const data = await r.json();
      if (!r.ok) { setError(data.error?.message || 'Failed to place order'); return; }
      setOrderId(data.orderId);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(orderId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (orderId) return (
    <div className="ed-order-result">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, color: '#059669' }}>
        <Icon name="check-circle" size={40} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#065F46' }}>Reservation received!</div>
      <div style={{ fontSize: 13, color: '#065F46', marginTop: 4 }}>Save your tracking number:</div>
      <div className="ed-order-id">{orderId}</div>
      <button className="ed-copy-btn" onClick={copy}>
        <Icon name="package" size={14} />
        {copied ? 'Copied!' : 'Copy Number'}
      </button>
      <div style={{ fontSize: 12, color: '#065F46', marginTop: 12 }}>
        Use this number at <a href="#/track" style={{ color: '#065F46', textDecoration: 'underline' }}>Track Order</a> to follow your shipment.
      </div>
    </div>
  );

  return (
    <form className="ed-order-form" onSubmit={onSubmit}>
      <div className="ed-form-group">
        <label className="ed-label-text">Full Name</label>
        <input className="ed-input" name="customerName" placeholder="Your name" value={form.customerName} onChange={onChange} required />
      </div>
      <div className="ed-form-group">
        <label className="ed-label-text">Email Address</label>
        <input className="ed-input" name="customerEmail" type="email" placeholder="your@email.com" value={form.customerEmail} onChange={onChange} required />
      </div>
      <div className="ed-form-group">
        <label className="ed-label-text">Phone Number</label>
        <input className="ed-input" name="customerPhone" placeholder="+20 xxx xxx xxxx" value={form.customerPhone} onChange={onChange} required />
      </div>
      {error && <p style={{ color: 'var(--ed-error)', fontSize: 13 }}>{error}</p>}
      <button type="submit" className="ed-btn ed-btn-primary ed-btn-full ed-btn-lg" disabled={loading}>
        <Icon name="car" size={18} />
        {loading ? 'Processing…' : 'Reserve This Vehicle'}
      </button>
      <p style={{ fontSize: 12, color: 'var(--ed-text-muted)', textAlign: 'center' }}>
        No payment required now. Our team will contact you within 24 hours.
      </p>
    </form>
  );
}

export default function CarDetailPage({ listingId }) {
  const [listing, setListing]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [activeColor, setActiveColor] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    fetch(`/api/listings/${listingId}`, { signal: controller.signal })
      .then(r => { clearTimeout(timer); if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setListing(d); setActiveColor(0); setLoading(false); })
      .catch(() => { clearTimeout(timer); setError('Vehicle not found.'); setLoading(false); });
    return () => { clearTimeout(timer); controller.abort(); };
  }, [listingId]);

  const finalPrice = listing
    ? calcFinalPrice(listing.basePrice, listing.shippingCost, listing.taxRate, listing.customsRate)
    : 0;

  const rawPhotos = listing ? (Array.isArray(listing.photos) ? listing.photos : []) : [];
  const colorVars = hasColorVariants(rawPhotos);
  const galleryUrls = colorVars
    ? (rawPhotos[activeColor]?.urls || [])
    : rawPhotos.filter(u => typeof u === 'string');
  const features = listing?.features ? (Array.isArray(listing.features) ? listing.features : []) : [];

  return (
    <div className="ed-page">
      <TopBar />
      <NavBar />
      <main className="ed-main">

        {/* Back link */}
        <div style={{ padding: '12px 20px' }}>
          <a href="#/vehicles" className="ed-back-link">
            <Icon name="chevron-left" size={16} /> Back to vehicles
          </a>
        </div>

        {loading && (
          <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--ed-text-muted)' }}>
            Loading vehicle details…
          </div>
        )}

        {error && (
          <div style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: 'var(--ed-text-light)' }}>
              <Icon name="search" size={48} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{error}</div>
            <a href="#/vehicles" className="ed-btn ed-btn-primary">Browse All Vehicles</a>
          </div>
        )}

        {listing && (
          <>
            <PhotoGallery urls={galleryUrls} />

            <div className="ed-detail-body">
              {/* Title */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span className="ed-badge ed-badge-new">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    Brand New
                  </span>
                  {listing.mjPrompt && (
                    <span className="ed-badge" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A' }}>Featured</span>
                  )}
                </div>
                <div className="ed-detail-make">{listing.make}</div>
                <h1 className="ed-h2">{listing.model} <span style={{ fontWeight: 500, color: 'var(--ed-text-muted)' }}>{listing.year}</span></h1>
                <div className="ed-detail-meta">
                  <span className="ed-car-meta-item"><Icon name="fuel" size={14} />{FUEL_LABELS[listing.fuelType] || listing.fuelType}</span>
                  <span className="ed-car-meta-sep" />
                  <span className="ed-car-meta-item"><Icon name="settings" size={14} />{listing.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual'}</span>
                  {listing.power && <><span className="ed-car-meta-sep" /><span className="ed-car-meta-item"><Icon name="zap" size={14} />{listing.power} hp</span></>}
                </div>
                <ColorSelector photos={rawPhotos} activeColor={activeColor} onSelect={setActiveColor} />
              </div>

              {/* Price card */}
              <div className="ed-price-card">
                <div className="ed-price-label">All-inclusive import price</div>
                <div className="ed-price-value">{fmtPrice(finalPrice)}</div>
                <div className="ed-price-note">Includes shipping, customs duties & all import fees. No hidden costs.</div>
              </div>

              {/* Specs */}
              <div className="ed-card">
                <div className="ed-h3" style={{ marginBottom: 12 }}>Specifications</div>
                <SpecRow label="Year"         value={listing.year} />
                <SpecRow label="Mileage"      value={listing.mileage === 0 ? '0 km — Brand New' : `${listing.mileage.toLocaleString()} km`} />
                <SpecRow label="Fuel Type"    value={FUEL_LABELS[listing.fuelType] || listing.fuelType} />
                <SpecRow label="Transmission" value={listing.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual'} />
                {listing.power      && <SpecRow label="Power"      value={`${listing.power} hp`} />}
                {listing.engineSize && <SpecRow label="Engine"     value={`${listing.engineSize}L`} />}
                {listing.color      && <SpecRow label="Colour"     value={listing.color} />}
                {listing.bodyType   && <SpecRow label="Body Type"  value={listing.bodyType} />}
                <SpecRow label="Condition" value="Brand New — Direct from Dealer" />
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div className="ed-card">
                  <div className="ed-h3" style={{ marginBottom: 12 }}>Key Features</div>
                  <div className="ed-features-chips">
                    {features.map(f => <span className="ed-chip" key={f}>{f}</span>)}
                  </div>
                </div>
              )}

              {/* Reservation */}
              <div className="ed-card">
                <div className="ed-h3" style={{ marginBottom: 6 }}>Reserve This Vehicle</div>
                <p className="ed-muted" style={{ fontSize: 13, marginBottom: 20 }}>
                  Fill in your details and our team will contact you within 24 hours to confirm your order.
                </p>
                {listing.status !== 'AVAILABLE' ? (
                  <div style={{ padding: 16, background: '#FEF3C7', borderRadius: 10, fontSize: 14, color: '#92400E' }}>
                    This vehicle is currently {listing.status.toLowerCase()}. Contact us for availability.
                  </div>
                ) : (
                  <OrderForm listing={listing} />
                )}
              </div>

            </div>
          </>
        )}

      </main>
      <Footer />
    </div>
  );
}
