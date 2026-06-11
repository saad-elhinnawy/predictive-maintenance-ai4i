import React, { useState, useEffect, useMemo } from 'react';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import { calcFinalPrice, fmtPrice } from '../constants/index.js';

const BRANDS     = ['Mercedes-Benz', 'BMW', 'Audi', 'Porsche'];
const BODY_TYPES  = ['Sedan', 'SUV', 'Coupe'];
const FUEL_TYPES  = ['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC'];
const FUEL_LABELS = { PETROL: 'Petrol', DIESEL: 'Diesel', HYBRID: 'Hybrid', ELECTRIC: 'Electric' };

function CarCard({ listing }) {
  const photos     = Array.isArray(listing.photos) ? listing.photos : [];
  const photo      = photos[0] || `https://picsum.photos/seed/${listing.id || 'car'}/800/500`;
  const finalPrice = calcFinalPrice(listing.basePrice, listing.shippingCost, listing.taxRate, listing.customsRate);

  return (
    <div className="ed-car-card" onClick={() => { window.location.hash = `#/vehicles/${listing.id}`; }}>
      <div className="ed-car-photo-wrap">
        <img className="ed-car-photo" src={photo} alt={`${listing.make} ${listing.model}`} loading="lazy" />
        <div className="ed-car-badge-tl">
          <span className="ed-badge ed-badge-new">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Brand New
          </span>
        </div>
      </div>
      <div className="ed-car-info">
        <div className="ed-car-make">{listing.make}</div>
        <div className="ed-car-model">
          {listing.model} <span className="ed-car-year">{listing.year}</span>
        </div>
        <div className="ed-car-meta">
          <span className="ed-car-meta-item">
            <Icon name="fuel" size={13} />
            {FUEL_LABELS[listing.fuelType] || listing.fuelType}
          </span>
          <span className="ed-car-meta-sep" />
          <span className="ed-car-meta-item">
            <Icon name="settings" size={13} />
            {listing.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual'}
          </span>
        </div>
        <div className="ed-car-price">{fmtPrice(finalPrice)}</div>
        <div className="ed-car-footer">
          <div className="ed-car-price-label">All-inclusive price</div>
          <span className="ed-car-view">View →</span>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="ed-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="ed-skeleton" style={{ height: 200 }} />
      <div style={{ padding: 16 }}>
        <div className="ed-skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
        <div className="ed-skeleton" style={{ height: 18, width: '70%', marginBottom: 10 }} />
        <div className="ed-skeleton" style={{ height: 12, width: '55%', marginBottom: 14 }} />
        <div className="ed-skeleton" style={{ height: 26, width: '50%' }} />
      </div>
    </div>
  );
}

export default function CataloguePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [sort, setSort]         = useState('newest');
  const [brand, setBrand]       = useState('');
  const [bodyType, setBodyType] = useState('');
  const [fuelType, setFuelType] = useState('');

  useEffect(() => {
    fetch('/api/listings?limit=50')
      .then(r => r.json())
      .then(d => { setListings(d.listings || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let out = [...listings];
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(l => `${l.make} ${l.model} ${l.year}`.toLowerCase().includes(q));
    }
    if (brand)    out = out.filter(l => l.make === brand);
    if (bodyType) out = out.filter(l => l.bodyType === bodyType);
    if (fuelType) out = out.filter(l => l.fuelType === fuelType);
    if (sort === 'priceAsc')  out.sort((a, b) => a.basePrice - b.basePrice);
    if (sort === 'priceDesc') out.sort((a, b) => b.basePrice - a.basePrice);
    return out;
  }, [listings, search, brand, bodyType, fuelType, sort]);

  const hasFilters = !!(brand || bodyType || fuelType || search.trim());

  function clearAll() {
    setBrand(''); setBodyType(''); setFuelType(''); setSearch('');
  }

  return (
    <div className="ed-page">
      <TopBar />
      <NavBar />
      <main className="ed-main">

        <div className="ed-page-header">
          <div className="ed-container">
            <div className="ed-badge ed-badge-neutral" style={{ marginBottom: 14, display: 'inline-flex' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Brand New 2025 Models
            </div>
            <h1 className="ed-h1">Our Vehicle Collection</h1>
            <p className="ed-lead" style={{ marginTop: 8 }}>Premium European vehicles direct from authorized dealers</p>
          </div>
        </div>

        <div className="ed-filter-bar">
          <div className="ed-search-wrap" style={{ marginBottom: 12 }}>
            <span className="ed-search-icon"><Icon name="search" size={16} /></span>
            <input
              className="ed-input ed-search-input"
              placeholder="Search Mercedes, BMW, Audi, Porsche…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="ed-filter-pills">
            <select className="ed-filter-pill" value={brand} onChange={e => setBrand(e.target.value)}>
              <option value="">All Brands</option>
              {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select className="ed-filter-pill" value={fuelType} onChange={e => setFuelType(e.target.value)}>
              <option value="">Fuel Type</option>
              {FUEL_TYPES.map(f => <option key={f} value={f}>{FUEL_LABELS[f]}</option>)}
            </select>
            <select className="ed-filter-pill" value={bodyType} onChange={e => setBodyType(e.target.value)}>
              <option value="">Body Type</option>
              {BODY_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select className="ed-filter-pill" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
            </select>
          </div>

          {hasFilters && (
            <button className="ed-filter-clear" onClick={clearAll}>× Clear</button>
          )}

          {hasFilters && (brand || bodyType || fuelType) && (
            <div className="ed-active-filters">
              <span className="ed-active-label">Active filters:</span>
              {brand    && <span className="ed-filter-chip">{brand} <button onClick={() => setBrand('')}>×</button></span>}
              {fuelType && <span className="ed-filter-chip">{FUEL_LABELS[fuelType]} <button onClick={() => setFuelType('')}>×</button></span>}
              {bodyType && <span className="ed-filter-chip">{bodyType} <button onClick={() => setBodyType('')}>×</button></span>}
            </div>
          )}

          {!loading && (
            <div className="ed-results-count">
              {filtered.length} brand new {filtered.length === 1 ? 'vehicle' : 'vehicles'} available
            </div>
          )}
        </div>

        {loading ? (
          <div className="ed-car-grid">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="ed-empty-state">
            <div className="ed-empty-icon"><Icon name="car" size={52} /></div>
            <div className="ed-empty-title">No vehicles found</div>
            <div className="ed-empty-sub">Try adjusting your filters or search terms</div>
            {hasFilters && (
              <button className="ed-btn ed-btn-outline" onClick={clearAll}>Clear All Filters</button>
            )}
          </div>
        ) : (
          <div className="ed-car-grid">
            {filtered.map(l => <CarCard key={l.id} listing={l} />)}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
