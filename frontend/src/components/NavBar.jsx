import React, { useState } from 'react';
import EuroDriveLogo from './EuroDriveLogo';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <nav className="ed-navbar">
        <a href="#/" className="ed-navbar-logo">
          <EuroDriveLogo width={88} />
        </a>
        <button className="ed-hamburger" onClick={() => setOpen(true)} aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
      </nav>

      {open && (
        <div className="ed-drawer-overlay" onClick={close}>
          <div className="ed-drawer" onClick={e => e.stopPropagation()}>
            <div className="ed-drawer-header">
              <div className="ed-drawer-logo">
                <span style={{ fontSize: 18, fontWeight: 700 }}>Euro<span style={{ color: 'rgba(255,255,255,0.7)' }}>Drive</span></span>
              </div>
              <button className="ed-drawer-close" onClick={close}>✕</button>
            </div>
            <nav className="ed-drawer-nav">
              <a href="#/"         onClick={close}>Home</a>
              <a href="#/vehicles" onClick={close}>New Vehicles</a>
              <a href="#/track"    onClick={close}>Track Order</a>
              <a href="#/about"    onClick={close}>Who We Are</a>
              <a href="#/contact"  onClick={close}>Contact</a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
