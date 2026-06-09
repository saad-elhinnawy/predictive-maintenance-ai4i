import React from 'react';

/**
 * Dynamic wheel renderer.
 * Props:
 *   size     – diameter in px (default 80)
 *   wheelId  – 'five-spoke' | 'y-spoke' | 'm-double' | 'turbine' (default 'five-spoke')
 *   rimHex   – rim colour (default silver)
 *   darkMode – boolean
 */
export default function WheelSVG({ size = 80, wheelId = 'five-spoke', rimHex = '#B8BEC8', darkMode = false }) {
  const r = size / 2;
  const tyre     = darkMode ? '#111318' : '#1A1D22';
  const tyreSide = darkMode ? '#1C2030' : '#22262E';
  const rim      = rimHex;
  const rimDark  = shadeHex(rimHex, -40);
  const hubCap   = '#0A2540';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`wsvg-tyre-${size}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%"   stopColor={tyreSide} />
          <stop offset="100%" stopColor={tyre} />
        </radialGradient>
        <radialGradient id={`wsvg-rim-${size}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#E8ECF2" />
          <stop offset="70%"  stopColor={rim} />
          <stop offset="100%" stopColor={rimDark} />
        </radialGradient>
      </defs>

      {/* Tyre */}
      <circle cx={r} cy={r} r={r - 1} fill={`url(#wsvg-tyre-${size})`} />
      {/* Tyre sidewall highlight */}
      <circle cx={r} cy={r} r={r - 1} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />

      {/* Rim face */}
      <circle cx={r} cy={r} r={r * 0.72} fill={`url(#wsvg-rim-${size})`} />

      {/* Spokes */}
      <Spokes cx={r} cy={r} outerR={r * 0.72} innerR={r * 0.16} wheelId={wheelId} rim={rim} rimDark={rimDark} size={size} />

      {/* Centre hub */}
      <circle cx={r} cy={r} r={r * 0.14} fill={rimDark} />
      <circle cx={r} cy={r} r={r * 0.10} fill={hubCap} />
      {/* BMW roundel hint */}
      <circle cx={r} cy={r} r={r * 0.065} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
    </svg>
  );
}

function Spokes({ cx, cy, outerR, innerR, wheelId, rim, rimDark, size }) {
  switch (wheelId) {
    case 'y-spoke':    return <YSpokes    cx={cx} cy={cy} outerR={outerR} innerR={innerR} rim={rim} rimDark={rimDark} />;
    case 'm-double':   return <MDoubleSpokes cx={cx} cy={cy} outerR={outerR} innerR={innerR} rim={rim} rimDark={rimDark} />;
    case 'turbine':    return <TurbineSpokes cx={cx} cy={cy} outerR={outerR} innerR={innerR} rim={rim} rimDark={rimDark} />;
    default:           return <FiveSpokes  cx={cx} cy={cy} outerR={outerR} innerR={innerR} rim={rim} rimDark={rimDark} />;
  }
}

function FiveSpokes({ cx, cy, outerR, innerR, rim, rimDark }) {
  return (
    <>
      {[0, 72, 144, 216, 288].map((deg) => {
        const rad = (deg - 90) * (Math.PI / 180);
        const x1 = cx + innerR * Math.cos(rad);
        const y1 = cy + innerR * Math.sin(rad);
        const x2 = cx + outerR * 0.92 * Math.cos(rad);
        const y2 = cy + outerR * 0.92 * Math.sin(rad);
        return (
          <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={rim} strokeWidth={outerR * 0.16} strokeLinecap="round" />
        );
      })}
    </>
  );
}

function YSpokes({ cx, cy, outerR, innerR, rim, rimDark }) {
  return (
    <>
      {[0, 120, 240].map((deg) => {
        const rad1 = (deg - 90) * (Math.PI / 180);
        const rad2 = (deg - 90 + 20) * (Math.PI / 180);
        const rad3 = (deg - 90 - 20) * (Math.PI / 180);
        const ox  = cx + outerR * 0.9 * Math.cos(rad1);
        const oy  = cy + outerR * 0.9 * Math.sin(rad1);
        const ix  = cx + innerR * Math.cos(rad1);
        const iy  = cy + innerR * Math.sin(rad1);
        const l1x = cx + outerR * 0.88 * Math.cos(rad2);
        const l1y = cy + outerR * 0.88 * Math.sin(rad2);
        const l2x = cx + outerR * 0.88 * Math.cos(rad3);
        const l2y = cy + outerR * 0.88 * Math.sin(rad3);
        return (
          <g key={deg}>
            <line x1={ix} y1={iy} x2={ox} y2={oy} stroke={rim} strokeWidth={outerR * 0.14} strokeLinecap="round" />
            <line x1={ox} y1={oy} x2={l1x} y2={l1y} stroke={rimDark} strokeWidth={outerR * 0.09} strokeLinecap="round" />
            <line x1={ox} y1={oy} x2={l2x} y2={l2y} stroke={rimDark} strokeWidth={outerR * 0.09} strokeLinecap="round" />
          </g>
        );
      })}
    </>
  );
}

function MDoubleSpokes({ cx, cy, outerR, innerR, rim, rimDark }) {
  return (
    <>
      {[0, 72, 144, 216, 288].map((deg) => {
        const radA = (deg - 90 - 6) * (Math.PI / 180);
        const radB = (deg - 90 + 6) * (Math.PI / 180);
        const x1a = cx + innerR * Math.cos(radA), y1a = cy + innerR * Math.sin(radA);
        const x2a = cx + outerR * 0.9 * Math.cos(radA), y2a = cy + outerR * 0.9 * Math.sin(radA);
        const x1b = cx + innerR * Math.cos(radB), y1b = cy + innerR * Math.sin(radB);
        const x2b = cx + outerR * 0.9 * Math.cos(radB), y2b = cy + outerR * 0.9 * Math.sin(radB);
        return (
          <g key={deg}>
            <line x1={x1a} y1={y1a} x2={x2a} y2={y2a} stroke={rim}    strokeWidth={outerR * 0.10} strokeLinecap="round" />
            <line x1={x1b} y1={y1b} x2={x2b} y2={y2b} stroke={rimDark} strokeWidth={outerR * 0.07} strokeLinecap="round" />
          </g>
        );
      })}
    </>
  );
}

function TurbineSpokes({ cx, cy, outerR, innerR, rim, rimDark }) {
  const blades = 7;
  return (
    <>
      {Array.from({ length: blades }).map((_, i) => {
        const deg  = (i / blades) * 360 - 90;
        const deg2 = deg + 360 / blades * 0.6;
        const r1 = (deg  * Math.PI) / 180;
        const r2 = (deg2 * Math.PI) / 180;
        const x1 = cx + innerR * Math.cos(r1),      y1 = cy + innerR * Math.sin(r1);
        const x2 = cx + outerR * 0.88 * Math.cos(r2), y2 = cy + outerR * 0.88 * Math.sin(r2);
        return (
          <path
            key={i}
            d={`M ${cx},${cy} Q ${x1},${y1} ${x2},${y2}`}
            fill="none"
            stroke={rim}
            strokeWidth={outerR * 0.13}
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

function shadeHex(hex, amount) {
  const h   = hex.replace('#', '');
  const num = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r   = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g   = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b   = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}
