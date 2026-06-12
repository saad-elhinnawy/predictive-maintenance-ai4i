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
  const sw = 4.5;

  return (
    <svg width={width} viewBox="0 0 380 248" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>

      {/* ── Main body outline (boxy G-Wagon profile) ── */}
      <path
        d="M 58,152 L 58,44 L 74,22 L 96,18 L 304,18 L 328,40 L 342,76 L 342,152"
        fill="none" stroke={carColor} strokeWidth={sw}
        strokeLinejoin="round" strokeLinecap="round"
      />

      {/* ── Underbody with wheel arch cutouts ── */}
      <path
        d="M 58,152 L 82,152 Q 118,130 154,152 L 250,152 Q 286,130 322,152 L 342,152"
        fill="none" stroke={carColor} strokeWidth={sw}
        strokeLinejoin="round" strokeLinecap="round"
      />

      {/* ── Beltline (separates glass from lower body) ── */}
      <line x1="75" y1="88" x2="328" y2="88" stroke={carColor} strokeWidth={sw * 0.5} strokeLinecap="round" />

      {/* ── B-pillar ── */}
      <line x1="202" y1="22" x2="202" y2="152" stroke={carColor} strokeWidth={sw * 0.6} strokeLinecap="round" />

      {/* ── Rear C-pillar ── */}
      <line x1="74" y1="22" x2="58" y2="44" stroke={carColor} strokeWidth={sw * 0.55} strokeLinecap="round" />

      {/* ── Spare tyre (rear exterior mount) ── */}
      <circle cx="43" cy="88" r="36" fill="none" stroke={carColor} strokeWidth={sw} />
      <circle cx="43" cy="88" r="18" fill="none" stroke={carColor} strokeWidth={sw * 0.55} />
      <circle cx="43" cy="88" r="6"  fill="none" stroke={carColor} strokeWidth={sw * 0.5} />

      {/* ── Gear wheels ── */}
      <Gear cx={118} cy={186} r={34} color={gearColor} />
      <Gear cx={286} cy={186} r={34} color={gearColor} />
    </svg>
  );
}
