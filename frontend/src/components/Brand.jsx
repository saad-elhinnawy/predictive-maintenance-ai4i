import React from 'react';

export default function Brand({ size = 36, onClick }) {
  const handleClick = onClick ?? (() => (window.location.hash = '#/'));
  return (
    <div
      className="cv-brand"
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label="BMW Export home"
    >
      <svg
        className="cv-brand-logo"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
      >
        {/* Outer ring */}
        <circle cx="18" cy="18" r="17" fill="#0D1426" />
        {/* Quadrants clipped to inner circle — evenodd creates the cross gap */}
        <defs>
          <clipPath id="bmw-roundel">
            <circle cx="18" cy="18" r="14" />
          </clipPath>
        </defs>
        <g clipPath="url(#bmw-roundel)">
          {/* top-left: white */}
          <rect x="4"  y="4"  width="14" height="14" fill="#FFFFFF" />
          {/* top-right: BMW blue */}
          <rect x="18" y="4"  width="14" height="14" fill="#1C69D4" />
          {/* bottom-left: BMW blue */}
          <rect x="4"  y="18" width="14" height="14" fill="#1C69D4" />
          {/* bottom-right: white */}
          <rect x="18" y="18" width="14" height="14" fill="#FFFFFF" />
        </g>
        {/* Cross dividers */}
        <line x1="18" y1="4"  x2="18" y2="32" stroke="#0D1426" strokeWidth="1.5" />
        <line x1="4"  y1="18" x2="32" y2="18" stroke="#0D1426" strokeWidth="1.5" />
        {/* Inner ring border */}
        <circle cx="18" cy="18" r="14" fill="none" stroke="#8090B0" strokeWidth="0.8" />
        {/* Outer ring border */}
        <circle cx="18" cy="18" r="17" fill="none" stroke="#8090B0" strokeWidth="1.2" />
      </svg>
      <span className="cv-brand-name">
        BMW <span>Export</span>
      </span>
    </div>
  );
}
