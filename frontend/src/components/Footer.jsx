import React from 'react';
import { BRAND } from '../constants/index.js';
import Icon from './Icon';

function LogoIcon() {
  return (
    <div className="ed-logo-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    </div>
  );
}

const TRUST = [
  { iconName: 'shield', label: 'Licensed Importer', sub: 'Government Certified' },
  { iconName: 'star',   label: 'Brand New Cars',    sub: 'Direct from Dealers' },
  { iconName: 'award',  label: '500+ Imports',      sub: 'Successfully Delivered' },
  { iconName: 'clock',  label: '10+ Years',         sub: 'Industry Experience' },
];

export default function Footer() {
  return (
    <footer>
      <div className="ed-footer-trust">
        <div className="ed-trust-grid">
          {TRUST.map(t => (
            <div className="ed-trust-item" key={t.label}>
              <div className="ed-trust-icon"><Icon name={t.iconName} size={20} /></div>
              <div>
                <div className="ed-trust-label">{t.label}</div>
                <div className="ed-trust-sub">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ed-footer-main">
        <div className="ed-container">
          <div className="ed-footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <LogoIcon />
                <div className="ed-footer-brand-name">Euro<span>Drive</span></div>
              </div>
              <p className="ed-footer-tagline" style={{ marginTop: 10 }}>
                Premium brand new European cars imported directly from Germany. All-inclusive pricing, real-time tracking, and complete documentation services.
              </p>
              <div className="ed-footer-socials">
                <a href="#" className="ed-social-icon" aria-label="Facebook"><Icon name="facebook" size={16} /></a>
                <a href="#" className="ed-social-icon" aria-label="Instagram"><Icon name="instagram" size={16} /></a>
                <a href="#" className="ed-social-icon" aria-label="LinkedIn"><Icon name="linkedin" size={16} /></a>
                <a href="#" className="ed-social-icon" aria-label="YouTube"><Icon name="youtube" size={16} /></a>
              </div>
            </div>

            <div className="ed-footer-col">
              <h4>Services</h4>
              <ul>
                <li><a href="#/vehicles">Car Import</a></li>
                <li><a href="#/contact">Customs Clearance</a></li>
                <li><a href="#/contact">Vehicle Inspection</a></li>
                <li><a href="#/track">Order Tracking</a></li>
              </ul>
            </div>

            <div className="ed-footer-col">
              <h4>Brands We Import</h4>
              <ul>
                <li><a href="#/vehicles">Mercedes-Benz</a></li>
                <li><a href="#/vehicles">BMW</a></li>
                <li><a href="#/vehicles">Audi</a></li>
                <li><a href="#/vehicles">Porsche</a></li>
                <li><a href="#/vehicles">Volkswagen</a></li>
              </ul>
            </div>

            <div className="ed-footer-col">
              <h4>Contact</h4>
              <div className="ed-footer-contact-item">
                <span className="ed-footer-contact-icon"><Icon name="phone" size={14} /></span>
                <div className="ed-footer-contact-text">
                  <a href={BRAND.phoneHref}>{BRAND.phone}</a><br />
                  {BRAND.hours}
                </div>
              </div>
              <div className="ed-footer-contact-item">
                <span className="ed-footer-contact-icon"><Icon name="mail" size={14} /></span>
                <div className="ed-footer-contact-text">
                  <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
                </div>
              </div>
              <div className="ed-footer-contact-item">
                <span className="ed-footer-contact-icon"><Icon name="map-pin" size={14} /></span>
                <div className="ed-footer-contact-text">{BRAND.address}</div>
              </div>
            </div>
          </div>

          <div className="ed-footer-bottom">
            <span className="ed-footer-copy">
              © 2026 EuroDrive. All rights reserved. Registered Import License {BRAND.license}
            </span>
            <div className="ed-footer-legal">
              <a href="#/contact">Privacy Policy</a>
              <a href="#/contact">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/201551050018?text=Hi%2C%20I%27m%20interested%20in%20importing%20a%20European%20car."
        className="ed-whatsapp-btn"
        aria-label="Chat on WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </footer>
  );
}
