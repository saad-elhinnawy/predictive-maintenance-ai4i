import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom ship icon — emoji div avoids PNG asset path issues
function makeShipIcon() {
  return L.divIcon({
    html: '<div style="font-size:26px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))">🚢</div>',
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

export default function VesselMap({ lat, lng, vesselName, label }) {
  const icon = useMemo(makeShipIcon, []);

  return (
    <div className="cv-map-container">
      <MapContainer
        center={[lat, lng]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[lat, lng]} icon={icon}>
          <Popup>
            <strong>{vesselName || 'Vessel'}</strong>
            <br />
            <span style={{ fontSize: 12, color: '#666' }}>
              {lat.toFixed(4)}°&nbsp;{lng >= 0 ? 'N' : 'S'},&nbsp;
              {Math.abs(lng).toFixed(4)}°&nbsp;{lng >= 0 ? 'E' : 'W'}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
