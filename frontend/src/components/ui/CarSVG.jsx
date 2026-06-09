import React from 'react';
import { C } from '../../constants';

/**
 * BMW G30 5 Series side-profile SVG.
 * Props:
 *   hex     – body colour (default Alpine White #EEEEE8)
 *   dark    – boolean, activates night-mode glass tint
 *   width   – rendered width in px (height auto-scales at 2.4:1 ratio)
 *   style   – extra inline styles on the root svg
 */
export default function CarSVG({ hex = '#EEEEE8', dark = false, width = 320, style = {} }) {
  const h = Math.round(width / 2.4);

  // Derived colours
  const body      = hex;
  const bodyDark  = shadeHex(hex, -28);
  const bodyLight = shadeHex(hex, 22);
  const glass     = dark ? 'rgba(20,30,50,0.82)' : 'rgba(140,180,220,0.55)';
  const glassEdge = dark ? 'rgba(40,60,90,0.9)'  : 'rgba(100,150,200,0.7)';
  const chrome    = '#C8CDD6';
  const chromeDk  = '#8A9099';
  const tyre      = '#1A1D22';
  const rim       = '#B0B8C4';

  return (
    <svg
      viewBox="0 0 480 200"
      width={width}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
      aria-label="BMW vehicle side profile"
    >
      <defs>
        <radialGradient id="csg-body" cx="50%" cy="30%" r="70%">
          <stop offset="0%"   stopColor={bodyLight} />
          <stop offset="60%"  stopColor={body} />
          <stop offset="100%" stopColor={bodyDark} />
        </radialGradient>
        <radialGradient id="csg-wheel" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#6A7280" />
          <stop offset="80%" stopColor={tyre} />
        </radialGradient>
        <radialGradient id="csg-rim" cx="45%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="#E0E4EA" />
          <stop offset="100%" stopColor={chromeDk} />
        </radialGradient>
        <filter id="csg-shadow" x="-5%" y="-5%" width="110%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.45" />
        </filter>
        <clipPath id="csg-body-clip">
          <path d="M60,145 L60,100 Q80,60 140,52 L200,46 Q240,38 270,44 L330,50 Q370,56 400,80 L420,145 Z" />
        </clipPath>
      </defs>

      {/* ── Ground shadow ── */}
      <ellipse cx="240" cy="168" rx="195" ry="9" fill="rgba(0,0,0,0.28)" />

      {/* ── Body shell ── */}
      <path
        d="M55,148 L58,100 Q78,58 142,50 L202,44 Q244,36 272,43 L334,49 Q376,55 406,82 L424,148 Z"
        fill="url(#csg-body)"
        filter="url(#csg-shadow)"
      />

      {/* ── Rocker panel / sill ── */}
      <path
        d="M80,148 L400,148 L406,155 Q300,160 180,160 Q100,160 74,155 Z"
        fill={bodyDark}
      />

      {/* ── Boot / trunk ── */}
      <path
        d="M356,50 Q392,58 412,85 L424,148 L390,148 L382,90 Q372,62 356,50 Z"
        fill={shadeHex(hex, -15)}
      />

      {/* ── Bonnet highlight ── */}
      <path
        d="M142,50 L202,44 Q244,36 270,44 L262,50 Q232,44 202,50 L148,56 Z"
        fill={bodyLight}
        opacity="0.55"
      />

      {/* ── Windscreen ── */}
      <path
        d="M194,48 L168,100 L258,100 L272,46 Z"
        fill={glass}
        stroke={glassEdge}
        strokeWidth="1.5"
      />
      {/* Windscreen glint */}
      <path d="M200,52 L180,88 L196,88 L212,52 Z" fill="rgba(255,255,255,0.18)" />

      {/* ── Rear window ── */}
      <path
        d="M286,46 L278,100 L344,100 L352,54 Z"
        fill={glass}
        stroke={glassEdge}
        strokeWidth="1.5"
      />
      <path d="M294,50 L286,88 L302,88 L308,50 Z" fill="rgba(255,255,255,0.14)" />

      {/* ── B-pillar ── */}
      <rect x="258" y="46" width="14" height="54" fill={bodyDark} rx="1" />

      {/* ── Door lines ── */}
      <line x1="256" y1="100" x2="248" y2="148" stroke={bodyDark} strokeWidth="1.5" opacity="0.7" />
      <line x1="164" y1="100" x2="158" y2="148" stroke={bodyDark} strokeWidth="1.5" opacity="0.6" />

      {/* ── Door handle strips ── */}
      <rect x="178" y="112" width="56" height="5" rx="2.5" fill={chrome} opacity="0.8" />
      <rect x="280" y="112" width="48" height="5" rx="2.5" fill={chrome} opacity="0.8" />

      {/* ── Chrome waistline ── */}
      <path
        d="M80,102 Q160,96 260,98 Q340,100 410,108"
        fill="none"
        stroke={chrome}
        strokeWidth="2"
        opacity="0.6"
      />

      {/* ── Front grille + kidney ── */}
      <rect x="58" y="118" width="22" height="18" rx="3" fill="#111" stroke={chrome} strokeWidth="1.2" />
      <rect x="64" y="120" width="4" height="14" rx="2" fill={chromeDk} />
      <rect x="70" y="120" width="4" height="14" rx="2" fill={chromeDk} />

      {/* ── Front bumper ── */}
      <path d="M55,148 Q56,158 74,160 L80,148 Z" fill={bodyDark} />
      <path d="M56,152 Q62,162 76,162" fill="none" stroke={chrome} strokeWidth="1.5" />

      {/* ── Headlight ── */}
      <path
        d="M62,104 Q68,96 90,98 L92,110 Q74,112 64,110 Z"
        fill="#E8F0FF"
        stroke={chromeDk}
        strokeWidth="1"
      />
      <path d="M68,104 L88,100 L90,106 L70,108 Z" fill="rgba(200,220,255,0.5)" />
      {/* DRL strip */}
      <line x1="64" y1="105" x2="90" y2="101" stroke="#4E9EFF" strokeWidth="1.8" opacity="0.8" />

      {/* ── Tail light ── */}
      <path
        d="M416,104 Q424,96 426,112 L418,114 Q412,112 412,106 Z"
        fill="#FF4444"
        opacity="0.85"
        stroke={chromeDk}
        strokeWidth="0.8"
      />
      <path
        d="M414,108 Q420,102 424,110 L418,112 Z"
        fill="#FF8888"
        opacity="0.6"
      />

      {/* ── Rear bumper ── */}
      <path d="M390,148 L424,148 Q428,158 420,162 L390,160 Z" fill={bodyDark} />

      {/* ── Front wheel arch ── */}
      <path
        d="M78,148 Q76,116 108,108 Q140,100 154,120 Q162,134 158,148 Z"
        fill={shadeHex(hex, -40)}
      />

      {/* ── Rear wheel arch ── */}
      <path
        d="M312,148 Q310,116 342,108 Q374,100 388,120 Q396,134 392,148 Z"
        fill={shadeHex(hex, -40)}
      />

      {/* ── Front tyre ── */}
      <circle cx="118" cy="153" r="28" fill="url(#csg-wheel)" />
      <circle cx="118" cy="153" r="22" fill={tyre} />
      <circle cx="118" cy="153" r="18" fill="url(#csg-rim)" />
      {/* Spokes */}
      {[0,60,120,180,240,300].map((deg) => (
        <line
          key={deg}
          x1={118 + 4  * Math.cos((deg * Math.PI) / 180)}
          y1={153 + 4  * Math.sin((deg * Math.PI) / 180)}
          x2={118 + 16 * Math.cos((deg * Math.PI) / 180)}
          y2={153 + 16 * Math.sin((deg * Math.PI) / 180)}
          stroke={chromeDk}
          strokeWidth="2.5"
        />
      ))}
      <circle cx="118" cy="153" r="5" fill={rim} />
      {/* BMW centre cap colour */}
      <circle cx="118" cy="153" r="3" fill="#0A2540" />

      {/* ── Rear tyre ── */}
      <circle cx="352" cy="153" r="28" fill="url(#csg-wheel)" />
      <circle cx="352" cy="153" r="22" fill={tyre} />
      <circle cx="352" cy="153" r="18" fill="url(#csg-rim)" />
      {[0,60,120,180,240,300].map((deg) => (
        <line
          key={deg}
          x1={352 + 4  * Math.cos((deg * Math.PI) / 180)}
          y1={153 + 4  * Math.sin((deg * Math.PI) / 180)}
          x2={352 + 16 * Math.cos((deg * Math.PI) / 180)}
          y2={153 + 16 * Math.sin((deg * Math.PI) / 180)}
          stroke={chromeDk}
          strokeWidth="2.5"
        />
      ))}
      <circle cx="352" cy="153" r="5" fill={rim} />
      <circle cx="352" cy="153" r="3" fill="#0A2540" />
    </svg>
  );
}

// Lighten (+) or darken (-) a hex colour by `amount` (0–255)
function shadeHex(hex, amount) {
  const h = hex.replace('#', '');
  const num = parseInt(h.length === 3
    ? h.split('').map((c) => c + c).join('')
    : h, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}
