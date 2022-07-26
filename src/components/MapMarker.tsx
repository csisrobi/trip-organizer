import { FC, useRef, useState, useEffect } from 'react';
import {
  FeatureGroup,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLng, LatLngExpression } from 'leaflet';

const MapMarker = ({
  showMarker,
  onChange,
  edit,
  height,
}: {
  showMarker: LatLngExpression;
  onChange?: Function;
  edit: boolean;
  height: string;
}) => {
  const mapRef = useRef();
  const center = {
    lat: showMarker ? showMarker[0] : 45.9442858,
    lng: showMarker ? showMarker[1] : 25.0094303,
  };
  console.log(edit);
  const [map, setMap] = useState(null);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (!edit) {
          window.open(
            `http://maps.google.com?q=${showMarker[0]},${showMarker[1]}`,
            '_blank',
            'noopener,noreferrer',
          );
        } else {
          onChange([e.latlng.lat, e.latlng.lng]);
        }
      },
    });
    return <></>;
  }

  return (
    <MapContainer
      style={{ height: height ? height : '600px', width: '100%' }}
      zoom={!edit ? 12 : 7}
      center={center}
      ref={mapRef}
      whenReady={setMap}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
      {showMarker && (
        <Marker position={showMarker} icon={customMarkerUserPos} />
      )}
    </MapContainer>
  );
};

export const customMarkerUserPos = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png',
  iconSize: [15, 20],
  iconAnchor: [5, 20],
  popupAnchor: [2, -40],
});
export default MapMarker;
