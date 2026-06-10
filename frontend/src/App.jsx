import React, { useState, useEffect } from 'react';
import HomePage      from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import CarDetailPage from './pages/CarDetailPage';
import TrackPage     from './pages/TrackPage';
import AboutPage     from './pages/AboutPage';
import ContactPage   from './pages/ContactPage';

function useHash() {
  const [hash, setHash] = useState(window.location.hash || '#/');
  useEffect(() => {
    const h = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHash();
  const path = hash.replace(/^#\/?/, '').split('?')[0];
  const seg  = path.split('/').filter(Boolean);

  if (seg[0] === 'vehicles' && seg[1]) return <CarDetailPage listingId={seg[1]} />;
  if (seg[0] === 'vehicles')           return <CataloguePage />;
  if (seg[0] === 'track')              return <TrackPage orderId={seg[1]} />;
  if (seg[0] === 'about')              return <AboutPage />;
  if (seg[0] === 'contact')            return <ContactPage />;
  return <HomePage />;
}
