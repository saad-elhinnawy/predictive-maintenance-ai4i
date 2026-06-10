import React from 'react';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { BRAND } from '../constants/index.js';

const FEATURES = [
  { icon: '🛡️', title: 'Brand New Only',      desc: 'Direct from authorized European dealers' },
  { icon: '💰', title: 'Transparent Pricing',  desc: 'All-inclusive price, no hidden fees' },
  { icon: '🚢', title: 'Live Tracking',        desc: 'Real-time vessel tracking via MarineTraffic' },
  { icon: '🏆', title: '10+ Years',            desc: '500+ vehicles imported to Egypt' },
];

const STEPS = [
  { num: '01', icon: '🔍', title: 'Choose Your Car',         desc: 'Browse our selection of brand new European vehicles from authorized dealers.' },
  { num: '02', icon: '💬', title: 'Get All-Inclusive Quote', desc: 'See the final price including shipping, customs, and all import fees upfront.' },
  { num: '03', icon: '📋', title: 'We Handle Everything',    desc: 'Professional inspection, purchase, export documentation, and shipping.' },
  { num: '04', icon: '🚢', title: 'Track to Delivery',       desc: 'Real-time tracking from Germany to your doorstep in Egypt.' },
];

const BENEFITS = [
  { icon: '⭐', title: 'Brand New Only',           desc: 'Direct from authorized European dealers' },
  { icon: '✅', title: 'All-Inclusive Price',       desc: 'Complete cost breakdown shown upfront' },
  { icon: '📄', title: 'Full Documentation',        desc: 'Complete customs and registration support' },
];

export default function HomePage() {
  return (
    <div className="ed-page">
      <TopBar />
      <NavBar />
      <main className="ed-main">

        {/* Hero */}
        <section className="ed-hero">
          <div className="ed-container">
            <div className="ed-hero-badge">
              <span style={{ color: '#F59E0B' }}>⭐</span>
              <span className="ed-badge ed-badge-teal">Authorized European Dealer Network</span>
            </div>
            <h1 className="ed-h1">
              Brand New European<br />
              <span className="ed-teal">Premium Cars</span><br />
              Delivered to Egypt
            </h1>
            <p className="ed-lead" style={{ marginTop: 16, marginBottom: 32 }}>
              Import brand new Mercedes-Benz, BMW, Audi, and Porsche directly from Germany.
              All-inclusive pricing with real-time tracking and complete documentation.
            </p>
            <div className="ed-hero-ctas">
              <a href="#/vehicles" className="ed-btn ed-btn-primary ed-btn-lg">
                Browse New Vehicles →
              </a>
              <a href="#/vehicles" className="ed-btn ed-btn-outline ed-btn-lg">
                🧮 Calculate Import Price
              </a>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <div style={{ padding: '0 0 32px' }}>
          <div className="ed-stats-row">
            <div className="ed-stat-item">
              <div className="ed-stat-icon">🛡️</div>
              <div>
                <div className="ed-stat-label">Licensed Importer</div>
                <div className="ed-stat-sub">Gov. Certified</div>
              </div>
            </div>
            <div className="ed-stat-item">
              <div className="ed-stat-icon">🚗</div>
              <div>
                <div className="ed-stat-label">500+ Cars</div>
                <div className="ed-stat-sub">Delivered</div>
              </div>
            </div>
            <div className="ed-stat-item">
              <div className="ed-stat-icon">🚢</div>
              <div>
                <div className="ed-stat-label">Live Tracking</div>
                <div className="ed-stat-sub">MarineTraffic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <section className="ed-features-section">
          <div className="ed-container">
            <div className="ed-features-grid">
              {FEATURES.map(f => (
                <div className="ed-card ed-feature-card" key={f.title}>
                  <div className="ed-feature-icon">{f.icon}</div>
                  <div className="ed-feature-title">{f.title}</div>
                  <div className="ed-feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="ed-how-section">
          <div className="ed-container">
            <div className="ed-center">
              <div className="ed-label">Simple Process</div>
              <h2 className="ed-h2" style={{ marginTop: 8 }}>How Import Works</h2>
              <p className="ed-lead" style={{ marginTop: 8 }}>
                From selecting your brand new car to delivery — we handle everything with full transparency.
              </p>
            </div>
            <div className="ed-steps">
              {STEPS.map(s => (
                <div className="ed-step" key={s.num}>
                  <div className="ed-step-icon-wrap">
                    <div className="ed-step-icon" style={{ fontSize: 28 }}>{s.icon}</div>
                    <div className="ed-step-num">{s.num}</div>
                  </div>
                  <div>
                    <div className="ed-step-title">{s.title}</div>
                    <div className="ed-step-desc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="ed-benefits-section">
          <div className="ed-container">
            {BENEFITS.map(b => (
              <div className="ed-benefit-item" key={b.title}>
                <span className="ed-benefit-icon" style={{ fontSize: 24 }}>{b.icon}</span>
                <div>
                  <div className="ed-benefit-title">{b.title}</div>
                  <div className="ed-benefit-desc">{b.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 32 }}>
              <a href="#/vehicles" className="ed-btn ed-btn-dark ed-btn-lg">
                Browse Our Vehicles →
              </a>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="ed-cta-banner">
          <div className="ed-container">
            <h2 className="ed-h2">Import Your Brand New European Car</h2>
            <p className="ed-lead">
              Direct from authorized German dealers. All-inclusive pricing with complete transparency.
              Real-time tracking from purchase to delivery.
            </p>
            <div className="ed-cta-stats">
              <div className="ed-cta-stat">
                <span className="ed-cta-stat-num">500+</span>
                <div className="ed-cta-stat-label">Cars Imported</div>
              </div>
              <div className="ed-cta-stat">
                <span className="ed-cta-stat-num">100%</span>
                <div className="ed-cta-stat-label">Brand New Cars</div>
              </div>
              <div className="ed-cta-stat">
                <span className="ed-cta-stat-num">10+</span>
                <div className="ed-cta-stat-label">Years Experience</div>
              </div>
            </div>
            <a href="#/vehicles" className="ed-btn ed-btn-outline" style={{ borderColor: 'rgba(255,255,255,.5)', color: '#fff' }}>
              Browse New Vehicles →
            </a>
          </div>
        </section>

        {/* Contact strip */}
        <div className="ed-contact-strip">
          <h3>Contact us:</h3>
          <div className="ed-contact-strip-info">
            <div className="ed-contact-strip-item">
              📞 <a href={BRAND.phoneHref} style={{ color: 'inherit' }}>{BRAND.phone}</a>
            </div>
            <div className="ed-contact-strip-sep" />
            <div className="ed-contact-strip-item">
              ✉️ <a href={`mailto:${BRAND.email}`} style={{ color: 'inherit' }}>{BRAND.email}</a>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
