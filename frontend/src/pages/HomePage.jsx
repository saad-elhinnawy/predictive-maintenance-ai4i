import React from 'react';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import { BRAND } from '../constants/index.js';

const STATS = [
  { icon: 'shield', label: 'Licensed Importer', sub: 'Gov. Certified' },
  { icon: 'truck',  label: '500+ Cars',          sub: 'Delivered' },
  { icon: 'ship',   label: 'Live Tracking',       sub: 'MarineTraffic' },
];

const FEATURES = [
  { icon: 'shield',     title: 'Brand New Only',       desc: 'Direct from authorized European dealers' },
  { icon: 'calculator', title: 'Transparent Pricing',  desc: 'All-inclusive price, no hidden fees' },
  { icon: 'ship',       title: 'Live Tracking',        desc: 'Real-time vessel tracking via MarineTraffic' },
  { icon: 'award',      title: '10+ Years',            desc: '500+ vehicles imported to Egypt' },
];

const STEPS = [
  { num: '01', icon: 'search',     title: 'Choose Your Car',         desc: 'Browse our selection of brand new European vehicles from authorized dealers.' },
  { num: '02', icon: 'calculator', title: 'Get All-Inclusive Quote', desc: 'See the final price including shipping, customs, and all import fees upfront.' },
  { num: '03', icon: 'file-check', title: 'We Handle Everything',    desc: 'Professional inspection, purchase, export documentation, and shipping.' },
  { num: '04', icon: 'ship',       title: 'Track to Delivery',       desc: 'Real-time tracking from Germany to your doorstep in Egypt.' },
];

const BENEFITS = [
  { icon: 'shield',     title: 'Brand New Only',      desc: 'Direct from authorized European dealers' },
  { icon: 'check',      title: 'All-Inclusive Price', desc: 'Complete cost breakdown shown upfront' },
  { icon: 'file-check', title: 'Full Documentation',  desc: 'Complete customs and registration support' },
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
              <span className="ed-badge ed-badge-neutral">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Authorized European Dealer Network
              </span>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2"/>
                  <line x1="8" y1="6" x2="16" y2="6"/>
                  <line x1="8" y1="10" x2="8" y2="18"/>
                  <line x1="12" y1="10" x2="12" y2="18"/>
                  <line x1="16" y1="10" x2="16" y2="18"/>
                  <line x1="8" y1="14" x2="16" y2="14"/>
                </svg>
                Calculate Import Price
              </a>
            </div>
          </div>
        </section>

        {/* Stats row — 2-column */}
        <div className="ed-stats-wrap">
          <div className="ed-stats-row">
            {STATS.map(s => (
              <div className="ed-stat-item" key={s.label}>
                <div className="ed-stat-icon"><Icon name={s.icon} size={20} /></div>
                <div>
                  <div className="ed-stat-label">{s.label}</div>
                  <div className="ed-stat-sub">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <section className="ed-features-section">
          <div className="ed-container">
            <div className="ed-features-grid">
              {FEATURES.map(f => (
                <div className="ed-card ed-feature-card" key={f.title}>
                  <div className="ed-feature-icon"><Icon name={f.icon} size={22} /></div>
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
                    <div className="ed-step-icon"><Icon name={s.icon} size={36} /></div>
                    <div className="ed-step-num">{s.num}</div>
                  </div>
                  <div className="ed-step-title">{s.title}</div>
                  <div className="ed-step-desc">{s.desc}</div>
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
                <span className="ed-benefit-icon"><Icon name={b.icon} size={22} /></span>
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
              <Icon name="phone" size={16} />
              <a href={BRAND.phoneHref} style={{ color: 'inherit' }}>{BRAND.phone}</a>
            </div>
            <div className="ed-contact-strip-sep" />
            <div className="ed-contact-strip-item">
              <Icon name="mail" size={16} />
              <a href={`mailto:${BRAND.email}`} style={{ color: 'inherit' }}>{BRAND.email}</a>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
