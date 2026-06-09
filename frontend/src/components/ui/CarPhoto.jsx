import React, { useState, useEffect } from 'react';
import { C } from '../../constants';
import useBlob from './useBlob';
import CarSVG from './CarSVG';

/**
 * Loads an external car photo via safe blob fetch with fade-in.
 * Falls back to CarSVG when no src, or on load error.
 *
 * Props:
 *   src      – remote image URL (Wikimedia or any CDN). Optional.
 *   hex      – body colour forwarded to CarSVG fallback
 *   dark     – night mode forwarded to CarSVG
 *   width    – rendered width in px (default 320)
 *   alt      – img alt text
 *   style    – extra inline styles on wrapper
 */
export default function CarPhoto({ src, hex = '#EEEEE8', dark = false, width = 320, alt = 'Vehicle', style = {} }) {
  const { blobUrl, loading, error } = useBlob(src || null);
  const [visible, setVisible] = useState(false);

  // Reset fade when src changes
  useEffect(() => { setVisible(false); }, [src]);

  const showPhoto = !!(blobUrl && !error);

  return (
    <div
      style={{
        width,
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      {/* Loading spinner */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 10,
          background: 'rgba(10,15,30,0.6)',
          borderRadius: 8,
          zIndex: 2,
        }}>
          <div style={{
            width: 28, height: 28,
            border: `3px solid ${C.border}`,
            borderTopColor: C.accent,
            borderRadius: '50%',
            animation: 'cv-spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 11, color: C.textDim }}>Loading photo…</span>
        </div>
      )}

      {/* Photo — fades in when loaded */}
      {showPhoto && (
        <img
          src={blobUrl}
          alt={alt}
          width={width}
          onLoad={() => setVisible(true)}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            borderRadius: 8,
            opacity: visible ? 1 : 0,
            transition: 'opacity 600ms ease',
            animation: visible ? 'cv-fade-in 600ms ease forwards' : 'none',
          }}
        />
      )}

      {/* SVG fallback — shown when no src, loading failed, or photo still loading */}
      {(!showPhoto) && !loading && (
        <CarSVG hex={hex} dark={dark} width={width} />
      )}

      {/* Keep SVG under photo while image loads so layout doesn't shift */}
      {showPhoto && !visible && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <CarSVG hex={hex} dark={dark} width={width} />
        </div>
      )}
    </div>
  );
}
