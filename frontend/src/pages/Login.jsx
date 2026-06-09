import React, { useState } from 'react';
import Brand from '../components/Brand';
import LangSwitcher from '../components/LangSwitcher';
import Silhouette from '../components/Silhouette';
import { t } from '../constants';

export default function Login({ lang, setLang }) {
  const tr = t[lang];
  const isRtl = lang === 'ar';

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // After auth, redirect to ?next= or home
  function redirect() {
    const hash = window.location.hash;
    const queryStr = hash.includes('?') ? hash.split('?')[1] : '';
    const next = new URLSearchParams(queryStr).get('next');
    window.location.hash = next ? decodeURIComponent(next) : '#/';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login'
      ? { email, password }
      : { email, password, name };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data?.error?.formErrors?.[0] ??
          data?.error?.fieldErrors?.email?.[0] ??
          data?.error?.fieldErrors?.password?.[0] ??
          data?.error ??
          tr.invalidCred
        );
        return;
      }

      localStorage.setItem('bmw_token', data.token);
      localStorage.setItem('bmw_user', JSON.stringify(data.user));
      redirect();
    } catch {
      setError(tr.errorFetch);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cv-login-page" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Minimal header */}
      <header style={{
        background: 'rgba(17,24,39,.9)',
        borderBottom: '1px solid var(--cv-border)',
        backdropFilter: 'blur(12px)',
      }}>
        <div className="cv-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            <Brand />
            <LangSwitcher lang={lang} onChange={setLang} />
          </div>
        </div>
      </header>

      {/* Hero + form */}
      <div className="cv-login-hero">
        {/* Background silhouette */}
        <Silhouette
          width={380}
          opacity={0.06}
          style={{ position: 'absolute', bottom: 30, right: -20, pointerEvents: 'none' }}
        />

        <div className="cv-login-card">
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Brand size={48} onClick={() => {}} />
            <h1 style={{ fontSize: 22, fontWeight: 700, marginTop: 20, marginBottom: 6 }}>
              {mode === 'login' ? tr.loginTitle : tr.registerTitle}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--cv-text-muted)' }}>
              {mode === 'login' ? tr.loginSubtitle : tr.registerSubtitle}
            </p>
          </div>

          {/* Card */}
          <div className="cv-card">
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {mode === 'register' && (
                  <div className="cv-form-group">
                    <label className="cv-label" htmlFor="cv-name">{tr.name}</label>
                    <input
                      id="cv-name"
                      className="cv-input"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      minLength={2}
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div className="cv-form-group">
                  <label className="cv-label" htmlFor="cv-email">{tr.email}</label>
                  <input
                    id="cv-email"
                    className="cv-input"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>

                <div className="cv-form-group">
                  <label className="cv-label" htmlFor="cv-password">{tr.password}</label>
                  <input
                    id="cv-password"
                    className="cv-input"
                    type="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <p style={{
                    fontSize: 13,
                    color: 'var(--cv-error)',
                    background: 'var(--cv-error-bg)',
                    border: '1px solid rgba(231,76,60,.25)',
                    borderRadius: 'var(--cv-radius-sm)',
                    padding: '10px 12px',
                  }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="cv-btn cv-btn-primary cv-w-full"
                  disabled={loading}
                  style={{ marginTop: 4 }}
                >
                  {loading ? '…' : (mode === 'login' ? tr.signIn : tr.register)}
                </button>
              </div>
            </form>

            <div className="cv-divider" />

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--cv-text-dim)' }}>
              {mode === 'login' ? tr.dontHaveAccount : tr.alreadyHaveAccount}
              {' '}
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--cv-accent)',
                  fontWeight: 600,
                  fontSize: 13,
                  fontFamily: 'inherit',
                  padding: 0,
                }}
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              >
                {mode === 'login' ? tr.register : tr.signIn}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
