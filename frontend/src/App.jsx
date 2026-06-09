import React, { useState, useEffect, useCallback } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import TrackingDashboard from './pages/TrackingDashboard';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminOrderDetail from './pages/Admin/AdminOrderDetail';

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/');
  useEffect(() => {
    const handler = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  const [lang, setLang] = useState(
    () => localStorage.getItem('cv_lang') || 'en',
  );

  const handleSetLang = useCallback((l) => {
    setLang(l);
    localStorage.setItem('cv_lang', l);
  }, []);

  // Parse route: '#/foo/bar?x=y' → segments ['foo','bar']
  const withoutHash = hash.replace(/^#\/?/, '');
  const pathPart = withoutHash.split('?')[0];
  const segments = pathPart.split('/').filter(Boolean);

  const commonProps = { lang, setLang: handleSetLang };

  // ── Admin routes ─────────────────────────────────────────
  if (segments[0] === 'admin') {
    const token = localStorage.getItem('bmw_token');
    const user  = JSON.parse(localStorage.getItem('bmw_user') || '{}');
    if (!token || user?.role !== 'ADMIN') {
      // useAdminGuard inside each page also handles this, but short-circuit here too
      return <Login {...commonProps} />;
    }
    // #/admin/orders/:orderId
    if (segments[1] === 'orders' && segments[2]) {
      return <AdminOrderDetail {...commonProps} orderId={segments[2]} />;
    }
    // #/admin (orders list is the default admin page)
    return <AdminOrders {...commonProps} />;
  }

  // ── Customer routes ───────────────────────────────────────
  if (segments[0] === 'tracking' && segments[1]) {
    return <TrackingDashboard {...commonProps} orderId={segments[1]} />;
  }

  if (segments[0] === 'login') {
    return <Login {...commonProps} />;
  }

  // Root — redirect to login if unauthenticated, admin panel if ADMIN
  const token = localStorage.getItem('bmw_token');
  if (!token) return <Login {...commonProps} />;

  const rootUser = JSON.parse(localStorage.getItem('bmw_user') || '{}');
  if (rootUser?.role === 'ADMIN') {
    // Admins land on the admin panel
    window.location.hash = '#/admin';
    return null;
  }

  return <Home {...commonProps} />;
}
