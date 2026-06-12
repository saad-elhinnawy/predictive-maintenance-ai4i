import React from 'react';

function gearPoints(cx, cy, outerR, innerR, n = 8) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    const halfTooth = (Math.PI / n) * 0.42;
    const halfGap   = (Math.PI / n) * 0.58;
    pts.push(`${(cx + innerR * Math.cos(a - halfGap)).toFixed(2)},${(cy + innerR * Math.sin(a - halfGap)).toFixed(2)}`);
    pts.push(`${(cx + outerR * Math.cos(a - halfTooth)).toFixed(2)},${(cy + outerR * Math.sin(a - halfTooth)).toFixed(2)}`);
    pts.push(`${(cx + outerR * Math.cos(a + halfTooth)).toFixed(2)},${(cy + outerR * Math.sin(a + halfTooth)).toFixed(2)}`);
    pts.push(`${(cx + innerR * Math.cos(a + halfGap)).toFixed(2)},${(cy + innerR * Math.sin(a + halfGap)).toFixed(2)}`);
  }
  return pts.join(' ');
}

function Gear({ cx, cy, r, color }) {
  const outer = r;
  const inner = r * 0.72;
  const ring  = r * 0.52;
  const hub   = r * 0.30;
  const dot   = r * 0.13;
  return (
    <g>
      <polygon points={gearPoints(cx, cy, outer, inner, 8)} fill={color} />
      <circle cx={cx} cy={cy} r={ring} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={r * 0.11} />
      <circle cx={cx} cy={cy} r={hub} fill="white" />
      <circle cx={cx} cy={cy} r={dot} fill={color} />
    </g>
  );
}

export default function EuroDriveLogo({ width = 130, onDark = false }) {
  const carColor  = onDark ? 'rgba(255,255,255,0.85)' : '#AAAAAA';
  const gearColor = '#C49A2A';
  const sw = 4.2;

  return (
    <svg width={width} viewBox="0 0 360 228" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      {/* G-Wagon body outline */}
      <path
        d="M 55,160 L 55,90 L 68,57 L 92,38 L 300,38 L 322,57 L 340,90 L 340,160"
        fill="none" stroke={carColor} strokeWidth={sw}
        strokeLinejoin="round" strokeLinecap="round"
      />
      {/* Underbody with wheel arch cutouts */}
      <path
        d="M 55,160 L 78,160 Q 108,148 138,160 L 252,160 Q 282,148 312,160 L 340,160"
        fill="none" stroke={carColor} strokeWidth={sw}
        strokeLinejoin="round" strokeLinecap="round"
      />
      {/* B-pillar (door divider) */}
      <line x1="200" y1="51" x2="200" y2="160" stroke={carColor} strokeWidth={sw * 0.6} strokeLinecap="round" />
      {/* Rear C-pillar */}
      <line x1="68" y1="57" x2="92" y2="38" stroke={carColor} strokeWidth={sw * 0.55} strokeLinecap="round" />
      {/* Running board */}
      <line x1="128" y1="170" x2="298" y2="170" stroke={carColor} strokeWidth={sw * 0.85} strokeLinecap="round" />
      {/* Spare tyre */}
      <circle cx="43" cy="110" r="28" fill="none" stroke={carColor} strokeWidth={sw} />
      <circle cx="43" cy="110" r="13" fill="none" stroke={carColor} strokeWidth={sw * 0.55} />
      {/* Gear wheels */}
      <Gear cx={108} cy={188} r={30} color={gearColor} />
      <Gear cx={282} cy={188} r={30} color={gearColor} />
    </svg>
  );
}
