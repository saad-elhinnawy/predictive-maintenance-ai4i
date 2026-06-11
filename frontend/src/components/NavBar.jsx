import React, { useState } from 'react';

function LogoIcon() {
  return (
    <div className="ed-logo-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    </div>
  );
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <nav className="ed-navbar">
        <a href="#/" className="ed-navbar-logo">
          <LogoIcon />
          <span className="ed-logo-text">Euro<span>Drive</span></span>
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
                <LogoIcon />
                <span>Euro<span style={{color:'var(--ed-primary)'}}>Drive</span></span>
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
