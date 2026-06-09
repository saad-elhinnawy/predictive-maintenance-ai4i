import React from 'react';
import Brand from './Brand';
import LangSwitcher from './LangSwitcher';
import { t } from '../constants';

export default function NavBar({ lang, setLang, showBack = false, title = '' }) {
  const tr = t[lang];

  function handleBack() {
    if (history.length > 1) history.back();
    else window.location.hash = '#/';
  }

  return (
    <nav className="cv-navbar" role="navigation" aria-label="Main navigation">
      <div className="cv-container">
        <div className="cv-navbar-inner">
          <div className="cv-navbar-left">
            {showBack && (
              <button
                className="cv-btn cv-btn-ghost cv-btn-sm"
                onClick={handleBack}
                aria-label={tr.back}
              >
                {lang === 'ar' ? '→' : '←'}
              </button>
            )}
            <Brand />
            {title && (
              <>
                <span style={{ color: 'var(--cv-border)', userSelect: 'none' }}>/</span>
                <span className="cv-navbar-title">{title}</span>
              </>
            )}
          </div>

          <div className="cv-navbar-right">
            <LangSwitcher lang={lang} onChange={setLang} />
            {localStorage.getItem('bmw_token') && (
              <button
                className="cv-btn cv-btn-ghost cv-btn-sm"
                onClick={() => {
                  localStorage.removeItem('bmw_token');
                  localStorage.removeItem('bmw_user');
                  window.location.hash = '#/login';
                }}
              >
                {tr.logout}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
