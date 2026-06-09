import React from 'react';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'ar', label: 'AR' },
];

export default function LangSwitcher({ lang, onChange }) {
  return (
    <div className="cv-lang-switcher" role="group" aria-label="Language">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          className={`cv-lang-btn${lang === code ? ' active' : ''}`}
          onClick={() => onChange(code)}
          aria-pressed={lang === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
