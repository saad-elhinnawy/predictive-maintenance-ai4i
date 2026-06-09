import React, { useState, useEffect } from 'react';
import Brand from '../../components/Brand';
import LangSwitcher from '../../components/LangSwitcher';
import '../../styles/cv-admin.css';

const NAV = [
  { icon: '📋', label: 'Orders',    href: '#/admin',          exact: true  },
  { icon: '🚢', label: 'Shipments', href: '#/admin/shipments', disabled: true },
  { icon: '👥', label: 'Customers', href: '#/admin/customers', disabled: true },
];

const NAV_BOTTOM = [
  { icon: '⚙️', label: 'Settings',  href: '#/admin/settings',  disabled: true },
];

function isActive(href, exact, hash) {
  if (exact) return hash === href || hash === href + '/';
  return hash.startsWith(href);
}

// Guard: redirect non-admins immediately
export function useAdminGuard() {
  const token = localStorage.getItem('bmw_token');
  const user  = JSON.parse(localStorage.getItem('bmw_user') || '{}');
  const ok = !!(token && user?.role === 'ADMIN');
  useEffect(() => {
    if (!ok) window.location.hash = '#/login';
  }, [ok]);
  return ok;
}

export default function AdminLayout({ children, lang, setLang }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hash, setHash] = useState(window.location.hash || '#/admin');
  const user = JSON.parse(localStorage.getItem('bmw_user') || '{}');

  useEffect(() => {
    const handler = () => {
      setHash(window.location.hash);
      setSidebarOpen(false); // close sidebar on navigation
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  function handleLogout() {
    localStorage.removeItem('bmw_token');
    localStorage.removeItem('bmw_user');
    window.location.hash = '#/login';
  }

  function NavItem({ icon, label, href, disabled, exact }) {
    const active = !disabled && isActive(href, exact, hash);
    return (
      <button
        className={`cv-admin-nav-item${active ? ' active' : ''}`}
        disabled={disabled}
        onClick={() => !disabled && (window.location.hash = href)}
        title={disabled ? 'Coming soon' : undefined}
      >
        <span className="cv-admin-nav-icon">{icon}</span>
        <span>{label}</span>
        {disabled && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--cv-text-dim)' }}>
            soon
          </span>
        )}
      </button>
    );
  }

  const sidebar = (
    <aside className={`cv-admin-sidebar${sidebarOpen ? ' open' : ''}`}>
      {/* Header */}
      <div className="cv-admin-sidebar-header">
        <Brand onClick={() => (window.location.hash = '#/admin')} />
        <div className="cv-admin-badge">ADMIN CONSOLE</div>
      </div>

      {/* Navigation */}
      <nav className="cv-admin-nav">
        <div className="cv-admin-nav-section">Management</div>
        {NAV.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}

        <div className="cv-admin-nav-divider" />
        <div className="cv-admin-nav-section">System</div>
        {NAV_BOTTOM.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}

        <div className="cv-admin-nav-divider" />
        {/* Customer view link */}
        <button
          className="cv-admin-nav-item"
          onClick={() => (window.location.hash = '#/')}
        >
          <span className="cv-admin-nav-icon">👤</span>
          <span>Customer View</span>
        </button>
      </nav>

      {/* Footer — user info + lang + logout */}
      <div className="cv-admin-sidebar-footer">
        <LangSwitcher lang={lang} onChange={setLang} />
        <div className="cv-admin-user-info" style={{ marginTop: 12 }}>
          <div className="cv-admin-user-name">{user.name || 'Admin'}</div>
          <div className="cv-admin-user-email">{user.email}</div>
        </div>
        <button className="cv-btn cv-btn-ghost cv-btn-sm cv-w-full" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="cv-admin-layout">
      {/* Mobile overlay */}
      <div
        className={`cv-admin-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {sidebar}

      {/* Mobile top bar */}
      <div className="cv-admin-topbar">
        <button
          className="cv-btn cv-btn-ghost cv-btn-icon"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <Brand onClick={() => (window.location.hash = '#/admin')} size={28} />
        <div style={{ flex: 1 }} />
        <LangSwitcher lang={lang} onChange={setLang} />
      </div>

      {/* Page content */}
      <main className="cv-admin-main">
        <div className="cv-admin-content">{children}</div>
      </main>
    </div>
  );
}
