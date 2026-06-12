import React from 'react';

export default function EuroDriveLogo({ width = 130, onDark = false }) {
  const img = (
    <img
      src="/logo.jpeg"
      width={width}
      alt="EuroDrive"
      style={{ display: 'block', height: 'auto' }}
    />
  );

  if (onDark) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: '4px 10px',
        display: 'inline-flex',
        alignItems: 'center',
      }}>
        {img}
      </div>
    );
  }

  return img;
}
