import React from 'react';
import { C } from '../../constants';

/**
 * CSS-only interior mockup — dashboard + front seats viewed from above.
 * Props:
 *   upholstery  – seat colour hex (default charcoal)
 *   accent      – trim accent colour (default C.primary)
 *   width       – container width in px
 */
export default function InteriorView({ upholstery = '#2A2D35', accent = C.primary, width = 280 }) {
  const h = Math.round(width * 0.72);
  const s = width / 280; // scale factor

  const dash      = '#111520';
  const dashTop   = '#1A1E2A';
  const steering  = '#1C1F28';
  const trim      = accent;
  const seat      = upholstery;
  const seatLight = lighten(upholstery, 18);
  const seatDark  = lighten(upholstery, -18);
  const floor     = '#0D1020';
  const carpet    = '#181C28';

  return (
    <svg
      viewBox="0 0 280 200"
      width={width}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', borderRadius: 8 }}
      aria-label="Interior view"
    >
      <defs>
        <radialGradient id="iv-floor" cx="50%" cy="50%" r="60%">
          <stop offset="0%"   stopColor={carpet} />
          <stop offset="100%" stopColor={floor} />
        </radialGradient>
        <radialGradient id="iv-seat-l" cx="40%" cy="30%" r="60%">
          <stop offset="0%"   stopColor={seatLight} />
          <stop offset="100%" stopColor={seatDark} />
        </radialGradient>
        <radialGradient id="iv-seat-r" cx="60%" cy="30%" r="60%">
          <stop offset="0%"   stopColor={seatLight} />
          <stop offset="100%" stopColor={seatDark} />
        </radialGradient>
      </defs>

      {/* Floor */}
      <rect x="0" y="0" width="280" height="200" fill="url(#iv-floor)" rx="8" />

      {/* ── Dashboard ── */}
      <rect x="10" y="6" width="260" height="58" rx="6" fill={dashTop} />
      {/* Instrument cluster */}
      <ellipse cx="88" cy="28" rx="28" ry="18" fill={dash} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle  cx="88" cy="28" r="12"  fill="#0A0E18" />
      <line x1="88" y1="28" x2="97" y2="22" stroke={trim} strokeWidth="1.5" strokeLinecap="round" />
      {/* Speedometer arc */}
      <path d="M76,28 A12,12 0 0,1 100,28" fill="none" stroke={trim} strokeWidth="1.5" opacity="0.5" />
      {/* iDrive screen */}
      <rect x="120" y="10" width="92" height="42" rx="4" fill="#050810" stroke="rgba(78,158,255,0.2)" strokeWidth="1" />
      <rect x="124" y="14" width="84" height="34" rx="3" fill="#08101E" />
      {/* Map dots on screen */}
      {[[150,28],[162,24],[174,30],[158,34]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="rgba(78,158,255,0.4)" />
      ))}
      <line x1="140" y1="31" x2="175" y2="27" stroke="rgba(78,158,255,0.25)" strokeWidth="1" />
      {/* HUD colour accent strip */}
      <rect x="10" y="62" width="260" height="3" rx="1.5" fill={trim} opacity="0.5" />
      {/* Centre console strip */}
      <rect x="120" y="65" width="40" height="70" rx="4" fill={dash} />
      <rect x="126" y="72" width="28" height="14" rx="3" fill="#0A0E18" stroke={trim} strokeWidth="0.8" opacity="0.7" />
      {/* Gear selector */}
      <rect x="132" y="92" width="16" height="24" rx="8" fill={steering} />
      <circle cx="140" cy="100" r="6" fill="#1A1E28" stroke={trim} strokeWidth="0.8" />
      {/* Cup holders */}
      <circle cx="131" cy="125" r="7" fill="#0D1020" stroke={steering} strokeWidth="1" />
      <circle cx="149" cy="125" r="7" fill="#0D1020" stroke={steering} strokeWidth="1" />

      {/* ── Steering wheel ── */}
      <circle cx="88" cy="76" r="22" fill="none" stroke={steering} strokeWidth="7" />
      <circle cx="88" cy="76" r="6"  fill={steering} />
      {/* Steering spokes */}
      <line x1="88" y1="54" x2="88" y2="70" stroke={steering} strokeWidth="7" />
      <line x1="70" y1="88" x2="80" y2="79" stroke={steering} strokeWidth="6" />
      <line x1="106" y1="88" x2="96" y2="79" stroke={steering} strokeWidth="6" />
      {/* Grip */}
      <circle cx="88" cy="76" r="22" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
      {/* BMW logo hint */}
      <circle cx="88" cy="76" r="4" fill="#0A2540" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

      {/* ── Seats ── */}
      {/* Driver */}
      <rect x="22" y="95" width="76" height="90" rx="10" fill="url(#iv-seat-l)" />
      <rect x="30" y="100" width="60" height="55" rx="8" fill={seat} />
      {/* Seat stitching */}
      <rect x="36" y="108" width="48" height="38" rx="5" fill="none" stroke={trim} strokeWidth="0.7" strokeDasharray="3 3" opacity="0.4" />
      {/* Headrest */}
      <rect x="38" y="96" width="36" height="12" rx="6" fill={seatLight} />

      {/* Passenger */}
      <rect x="182" y="95" width="76" height="90" rx="10" fill="url(#iv-seat-r)" />
      <rect x="190" y="100" width="60" height="55" rx="8" fill={seat} />
      <rect x="196" y="108" width="48" height="38" rx="5" fill="none" stroke={trim} strokeWidth="0.7" strokeDasharray="3 3" opacity="0.4" />
      <rect x="206" y="96" width="36" height="12" rx="6" fill={seatLight} />
    </svg>
  );
}

function lighten(hex, amount) {
  const h   = hex.replace('#', '');
  const num = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r   = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g   = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b   = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}
