import React, { useState, useEffect, useMemo } from 'react';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import { calcFinalPrice, fmtPrice } from '../constants/index.js';

const BRANDS    = ['Mercedes-Benz', 'BMW', 'Audi', 'Porsche'];
const BODY_TYPES = ['Sedan', 'SUV', 'Coupe'];
const FUEL_TYPES = ['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC'];
const FUEL_LABELS = { PETROL: 'Petrol', DIESEL: 'Diesel', HYBRID: 'Hybrid', ELECTRIC: 'Electric' };

function CarCard({ listing }) {
  const photos     = Array.isArray(listing.photos) ? listing.photos : [];
  const photo      = photos[0] || 'https://picsum.photos/seed/car/800/500';
  const finalPrice = calcFinalPrice(listing.basePrice, listing.shippingCost, listing.taxRate, listing.customsRate);

  return (
    <div className="ed-car-card" onClick={() => { window.location.hash = `#/vehicles/${listing.id}`; }}>
      <div className="ed-car-photo-wrap">
        <img className="ed-car-photo" src={photo} alt={`${listing.make} ${listing.model}`} loading="lazy" />
        <div className="ed-car-photo-badge"><span className="ed-badge ed-badge-new">NEW</span></div>
      </div>
      <div className="ed-car-info">
        <div className="ed-car-make-model">{listing.year} {listing.make} {listing.model}</div>
        <div className="ed-car-meta">
          <span>{listing.mileage === 0 ? '0 km' : `${listing.mileage.toLocaleString()} km`}</span>
          <span>{FUEL_LABELS[listing.fuelType] || listing.fuelType}</span>
          <span>{listing.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'}</span>
          {listing.power && <span>{listing.power} hp</span>}
        </div>
        <div className="ed-car-price">{fmtPrice(finalPrice)}</div>
        <div className="ed-car-price-label">All-inclusive · import price</div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="ed-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="ed-skeleton" style={{ height: 180 }} />
      <div style={{ padding: 16 }}>
        <div className="ed-skeleton" style={{ height: 16, marginBottom: 10 }} />
        <div className="ed-skeleton" style={{ height: 12, width: '60%', marginBottom: 14 }} />
        <div className="ed-skeleton" style={{ height: 22, width: '40%' }} />
      </div>
    </div>
  );
}

export default function CataloguePage() {
  const [listings, setListings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [sort, setSort]               = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [brands, setBrands]           = useState([]);
  const [bodyTypes, setBodyTypes]     = useState([]);
  const [fuelTypes, setFuelTypes]     = useState([]);
  const [maxPrice, setMaxPrice]       = useState(400000);

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
    if (brands.length)    out = out.filter(l => brands.includes(l.make));
    if (bodyTypes.length) out = out.filter(l => bodyTypes.includes(l.bodyType));
    if (fuelTypes.length) out = out.filter(l => fuelTypes.includes(l.fuelType));
    out = out.filter(l => l.basePrice <= maxPrice);
    if (sort === 'priceAsc')  out.sort((a, b) => a.basePrice - b.basePrice);
    if (sort === 'priceDesc') out.sort((a, b) => b.basePrice - a.basePrice);
    return out;
  }, [listings, search, brands, bodyTypes, fuelTypes, maxPrice, sort]);

  function toggleFilter(list, setList, val) {
    setList(l => l.includes(val) ? l.filter(x => x !== val) : [...l, val]);
  }

  function clearAll() {
    setBrands([]); setBodyTypes([]); setFuelTypes([]); setMaxPrice(400000); setSearch('');
  }

  const activeFilterCount = brands.length + bodyTypes.length + fuelTypes.length + (maxPrice < 400000 ? 1 : 0);

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

        <div className="ed-search-row">
          <div className="ed-search-wrap">
            <span className="ed-search-icon"><Icon name="search" size={16} /></span>
            <input
              className="ed-input ed-search-input"
              placeholder="Search Mercedes, BMW, Audi, Porsche…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="ed-input ed-select" style={{ width: 'auto' }} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
          <button className="ed-btn ed-btn-outline ed-filter-btn" onClick={() => setShowFilters(true)}>
            <Icon name="sliders" size={16} /> Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </button>
        </div>

        {loading ? (
          <div className="ed-car-grid">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="ed-empty-state">
            <div className="ed-empty-icon"><Icon name="car" size={52} /></div>
            <div className="ed-empty-title">No vehicles found</div>
            <div className="ed-empty-sub">Try adjusting your filters or search terms</div>
            {(activeFilterCount > 0 || search) && (
              <button className="ed-btn ed-btn-outline" onClick={clearAll}>Clear All Filters</button>
            )}
          </div>
        ) : (
          <div className="ed-car-grid">
            {filtered.map(l => <CarCard key={l.id} listing={l} />)}
          </div>
        )}

        {showFilters && (
          <div className="ed-filters-overlay" onClick={() => setShowFilters(false)}>
            <div className="ed-filters-panel" onClick={e => e.stopPropagation()}>
              <div className="ed-filters-header">
                Filters
                <button onClick={() => setShowFilters(false)}>✕</button>
              </div>
              <div className="ed-filters-body">
                <div className="ed-filter-group">
                  <h4>Brand</h4>
                  <div className="ed-checkbox-list">
                    {BRANDS.map(b => (
                      <div className="ed-checkbox-item" key={b}>
                        <input type="checkbox" id={`b-${b}`} checked={brands.includes(b)} onChange={() => toggleFilter(brands, setBrands, b)} />
                        <label htmlFor={`b-${b}`}>{b}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ed-filter-group">
                  <h4>Body Type</h4>
                  <div className="ed-checkbox-list">
                    {BODY_TYPES.map(bt => (
                      <div className="ed-checkbox-item" key={bt}>
                        <input type="checkbox" id={`bt-${bt}`} checked={bodyTypes.includes(bt)} onChange={() => toggleFilter(bodyTypes, setBodyTypes, bt)} />
                        <label htmlFor={`bt-${bt}`}>{bt}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ed-filter-group">
                  <h4>Fuel Type</h4>
                  <div className="ed-checkbox-list">
                    {FUEL_TYPES.map(ft => (
                      <div className="ed-checkbox-item" key={ft}>
                        <input type="checkbox" id={`ft-${ft}`} checked={fuelTypes.includes(ft)} onChange={() => toggleFilter(fuelTypes, setFuelTypes, ft)} />
                        <label htmlFor={`ft-${ft}`}>{FUEL_LABELS[ft]}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ed-filter-group">
                  <h4>Price Range (EUR)</h4>
                  <input type="range" className="ed-range-slider" min={0} max={400000} step={5000} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
                  <div className="ed-range-labels"><span>€0</span><span>up to €{maxPrice.toLocaleString()}</span></div>
                </div>
              </div>
              <div className="ed-filters-footer">
                <button className="ed-btn ed-btn-primary ed-btn-full" onClick={() => setShowFilters(false)}>Apply Filters</button>
              </div>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
