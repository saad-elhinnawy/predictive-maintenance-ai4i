import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Icon from '../components/Icon';
import { BRAND } from '../constants/index.js';

const INFO = [
  { iconName: 'phone',   label: 'Phone',         val: BRAND.phone,   sub: BRAND.hours,           href: BRAND.phoneHref },
  { iconName: 'mail',    label: 'Email',         val: BRAND.email,   sub: 'We reply within 24 hours', href: `mailto:${BRAND.email}` },
  { iconName: 'map-pin', label: 'Location',      val: BRAND.address, sub: null },
  { iconName: 'clock',   label: 'Working Hours', val: 'Monday - Saturday', sub: '9:00 AM - 8:00 PM' },
];

const SUBJECTS = ['Car Import Enquiry', 'Customs Clearance', 'Vehicle Inspection', 'Order Tracking', 'General Enquiry'];

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSending(true); setError('');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error('Failed');
      setSent(true);
    } catch {
      setError('Failed to send message. Please try again or call us directly.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="ed-page">
      <TopBar />
      <NavBar />
      <main className="ed-main">

        {/* Header */}
        <div className="ed-page-header" style={{ background: 'linear-gradient(135deg, #0F172A 0%, var(--ed-primary-xdark) 100%)' }}>
          <div className="ed-container">
            <div className="ed-label" style={{ marginBottom: 12 }}>Contact Us</div>
            <h1 className="ed-h1">Get in Touch</h1>
            <p className="ed-lead" style={{ marginTop: 12 }}>
              Have questions about importing a car? Want to schedule a consultation?
              We're here to help you every step of the way.
            </p>
          </div>
        </div>

        {/* Info cards */}
        <div className="ed-contact-info-grid">
          {INFO.map(i => (
            <div className="ed-card ed-contact-info-card" key={i.label}>
              <div className="ed-cinfo-icon"><Icon name={i.iconName} size={20} /></div>
              <div>
                <div className="ed-cinfo-label">{i.label}</div>
                {i.href
                  ? <a href={i.href} className="ed-cinfo-val" style={{ color: 'var(--ed-primary)' }}>{i.val}</a>
                  : <div className="ed-cinfo-val">{i.val}</div>
                }
                {i.sub && <div className="ed-cinfo-sub">{i.sub}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="ed-contact-form-section">
          <h2>Send Us a Message</h2>
          <p>Fill out the form below and we'll get back to you as soon as possible.</p>

          {sent ? (
            <div style={{ padding: 24, background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, color: '#065F46' }}><Icon name="check-circle" size={32} /></div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#065F46' }}>Message sent!</div>
              <div style={{ fontSize: 14, color: '#065F46', marginTop: 4 }}>We'll get back to you within 24 hours.</div>
            </div>
          ) : (
            <form className="ed-contact-form" onSubmit={onSubmit}>
              <div className="ed-form-group">
                <label className="ed-label-text">Full Name</label>
                <input className="ed-input" name="name" placeholder="Your name" value={form.name} onChange={onChange} required />
              </div>
              <div className="ed-form-group">
                <label className="ed-label-text">Email Address</label>
                <input className="ed-input" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={onChange} required />
              </div>
              <div className="ed-form-group">
                <label className="ed-label-text">Phone Number</label>
                <input className="ed-input" name="phone" placeholder="+20 xxx xxx xxxx" value={form.phone} onChange={onChange} />
              </div>
              <div className="ed-form-group">
                <label className="ed-label-text">Subject</label>
                <select className="ed-input ed-select" name="subject" value={form.subject} onChange={onChange}>
                  <option value="">Select a subject</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="ed-form-group">
                <label className="ed-label-text">Message</label>
                <textarea className="ed-input ed-textarea" name="message" placeholder="Tell us about your requirements…" value={form.message} onChange={onChange} required />
              </div>
              {error && <p style={{ color: 'var(--ed-error)', fontSize: 14 }}>{error}</p>}
              <button type="submit" className="ed-btn ed-btn-dark ed-btn-full ed-btn-lg" disabled={sending}>
                {sending ? 'Sending…' : <><Icon name="mail" size={16} /> Send Message</>}
              </button>
            </form>
          )}
        </div>

        {/* Map placeholder */}
        <div className="ed-map-placeholder">
          <Icon name="map-pin" size={32} />
          <p>Map would be integrated here</p>
          <small>{BRAND.address}</small>
        </div>

      </main>
      <Footer />
    </div>
  );
}
