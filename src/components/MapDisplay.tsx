import { FC, useRef, useState } from 'react';
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';

const MapDisplay = ({ coordinates }: { coordinates: LatLngExpression[][] }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const markers = [coordinates[0], coordinates[coordinates.length - 1]];
  const center = {
    lat: coordinates[(coordinates.length / 2).toFixed()][0] || 45.9442858,
    lng: coordinates[(coordinates.length / 2).toFixed()][1] || 25.0094303,
  };
  return (
    <MapContainer
      style={{ height: '600px', width: '100%' }}
      zoom={12}
      center={center}
      ref={mapRef}
      whenReady={setMap}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
      {coordinates && <Polyline positions={coordinates} color="red" />}
      {markers.map((position, idx) => (
        <Marker key={idx} position={position} icon={customMarkerUserPos} />
      ))}
    </MapContainer>
  );
};

export const customMarkerUserPos = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png',
  iconSize: [15, 20],
  iconAnchor: [5, 20],
  popupAnchor: [2, -40],
});
export default MapDisplay;
