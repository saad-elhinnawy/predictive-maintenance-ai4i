import React, { useState, useEffect, useMemo } from 'react';
import NavBar from '../components/NavBar';
import { t, C, calcFinalPrice } from '../constants';

function fmtPrice(n, lang) {
  return new Intl.NumberFormat(
    lang === 'ar' ? 'ar-SA' : lang === 'de' ? 'de-DE' : 'en-US',
    { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
  ).format(n);
}

function CarCard({ listing, lang, onClick }) {
  const tr = t[lang];
  const photo = Array.isArray(listing.photos) ? listing.photos[0] : null;
  const finalPrice = calcFinalPrice(listing.basePrice, listing.shippingCost, listing.taxRate, listing.customsRate);
  const isNew = listing.condition === 'NEW';

  return (
    <div className="cv-car-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="cv-car-card-photo">
        {photo ? (
          <img src={photo} alt={`${listing.make} ${listing.model}`}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="cv-car-card-no-photo">🚗</div>
        )}
        <span className={`cv-car-card-badge ${isNew ? 'new' : 'used'}`}>
          {isNew ? tr.newCars : tr.usedCars}
        </span>
        {listing.sourceSite && (
          <span className="cv-car-card-source">{listing.sourceSite}</span>
        )}
      </div>

      <div className="cv-car-card-body">
        <div className="cv-car-card-title">
          {listing.make} {listing.model}
        </div>
        <div className="cv-car-card-year">{listing.year}</div>

        <div className="cv-car-card-specs">
          {listing.power && <span>{listing.power} {tr.hp}</span>}
          <span>{listing.fuelType}</span>
          <span>{listing.transmission}</span>
          {listing.mileage > 0 && (
            <span>{listing.mileage.toLocaleString()} {tr.km}</span>
          )}
        </div>

        {listing.color && (
          <div className="cv-car-card-color">{listing.color}</div>
        )}

        <div className="cv-car-card-price">{fmtPrice(finalPrice, lang)}</div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="cv-car-card cv-car-card-skeleton">
      <div className="cv-car-card-photo cv-skeleton" style={{ height: 200 }} />
      <div className="cv-car-card-body" style={{ gap: 10 }}>
        <div className="cv-skeleton" style={{ height: 18, width: '70%' }} />
        <div className="cv-skeleton" style={{ height: 14, width: '40%' }} />
        <div className="cv-skeleton" style={{ height: 14, width: '90%' }} />
        <div className="cv-skeleton" style={{ height: 22, width: '50%', marginTop: 8 }} />
      </div>
    </div>
  );
}

export default function CataloguePage({ lang, setLang }) {
  const tr     = t[lang];
  const isRtl  = lang === 'ar';

  const [listings,   setListings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [makeFilter, setMakeFilter] = useState('');
  const [condFilter, setCondFilter] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (makeFilter) params.set('make', makeFilter);
    fetch(`/api/listings?${params}&limit=50`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((d) => { setListings(d.listings); setError(null); })
      .catch(() => setError(tr.errorFetch))
      .finally(() => setLoading(false));
  }, [makeFilter, tr.errorFetch]);

  const makes = useMemo(() => {
    const set = new Set(listings.map((l) => l.make));
    return [...set].sort();
  }, [listings]);

  const filtered = useMemo(() => {
    if (!condFilter) return listings;
    return listings.filter((l) => l.condition === condFilter);
  }, [listings, condFilter]);

  return (
    <div className="cv-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <NavBar lang={lang} setLang={setLang} />

      {/* Hero band */}
      <div className="cv-catalogue-hero">
        <div className="cv-container">
          <h1 className="cv-h1" style={{ marginBottom: 8 }}>{tr.allCars}</h1>
          <p className="cv-text-sm cv-text-muted">{tr.browseCatalogue}</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="cv-catalogue-filters">
        <div className="cv-container">
          <div className="cv-filter-row">
            {/* Condition tabs */}
            <div className="cv-filter-tabs">
              {[['', tr.allConditions], ['NEW', tr.newCars], ['USED', tr.usedCars]].map(([val, label]) => (
                <button
                  key={val}
                  className={`cv-filter-tab${condFilter === val ? ' active' : ''}`}
                  onClick={() => setCondFilter(val)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Make select */}
            {makes.length > 1 && (
              <select
                className="cv-input cv-filter-select"
                value={makeFilter}
                onChange={(e) => setMakeFilter(e.target.value)}
              >
                <option value="">{tr.filterByMake}</option>
                {makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <main className="cv-main">
        <div className="cv-container">
          {error ? (
            <div className="cv-flex-center" style={{ minHeight: 280, color: C.error }}>
              {error}
            </div>
          ) : loading ? (
            <div className="cv-car-grid">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="cv-flex-center cv-col" style={{ minHeight: 280, gap: 16, color: C.textDim }}>
              <div style={{ fontSize: 48 }}>🚗</div>
              <p>{tr.noListings}</p>
            </div>
          ) : (
            <div className="cv-car-grid">
              {filtered.map((listing) => (
                <CarCard
                  key={listing.id}
                  listing={listing}
                  lang={lang}
                  onClick={() => (window.location.hash = `#/cars/${listing.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
