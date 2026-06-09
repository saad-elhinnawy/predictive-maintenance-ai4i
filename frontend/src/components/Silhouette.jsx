import React from 'react';

/**
 * BMW sedan side-profile silhouette.
 * Decorative — aria-hidden by default.
 */
export default function Silhouette({
  width = 300,
  color = '#1C69D4',
  opacity = 0.12,
  className = '',
  style = {},
}) {
  return (
    <svg
      width={width}
      viewBox="0 0 300 88"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ display: 'block', ...style }}
    >
      {/*
        Body path + wheel-arch cutouts via evenodd.
        Front wheel center ≈ x=72, rear ≈ x=218, both at y=78, r=17.
      */}
      <path
        fillRule="evenodd"
        fill={color}
        opacity={opacity}
        d="
          M6 78 L6 60
          C6 55 14 46 24 40
          L60 26 Q80 16 110 11
          L155 6 Q178 4 200 6
          L235 12 Q258 20 270 36
          L278 52 L280 64 L280 78 Z

          M55 78 m-17 0
          a17 17 0 1 0 34 0
          a17 17 0 1 0 -34 0

          M218 78 m-17 0
          a17 17 0 1 0 34 0
          a17 17 0 1 0 -34 0
        "
      />
    </svg>
  );
}
