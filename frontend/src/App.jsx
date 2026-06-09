import React, { useState, useEffect, useCallback } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import TrackingDashboard from './pages/TrackingDashboard';

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

  if (segments[0] === 'tracking' && segments[1]) {
    return <TrackingDashboard {...commonProps} orderId={segments[1]} />;
  }

  if (segments[0] === 'login') {
    return <Login {...commonProps} />;
  }

  // Root or unknown route — redirect to login if unauthenticated
  if (!localStorage.getItem('bmw_token')) {
    return <Login {...commonProps} />;
  }

  return <Home {...commonProps} />;
}
