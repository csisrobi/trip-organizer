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

const MapTest = ({ coordinates }: { coordinates: LatLngExpression[][] }) => {
  const mapRef = useRef();
  const center = {
    lat: coordinates[(coordinates.length / 2).toFixed()][0] || 45.9442858,
    lng: coordinates[(coordinates.length / 2).toFixed()][1] || 25.0094303,
  };
  const [map, setMap] = useState(null);
  return (
    <div>
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
      </MapContainer>
    </div>
  );
};

export default MapTest;
