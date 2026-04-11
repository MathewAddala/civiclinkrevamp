import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const DEFAULT_CENTER = [16.4427, 80.6228];

const reverseGeocode = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.display_name || null;
};

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

export default function LocationPickerMap({ value, onChange }) {
  const [isResolving, setIsResolving] = useState(false);

  const position = useMemo(() => {
    if (value?.lat && value?.lng) return [value.lat, value.lng];
    return null;
  }, [value]);

  const handlePick = async ({ lat, lng }) => {
    onChange({ ...value, lat, lng, address: value?.address || '' });
    setIsResolving(true);
    try {
      const address = await reverseGeocode(lat, lng);
      if (address) onChange({ ...value, lat, lng, address });
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="h-64 w-full overflow-hidden rounded-lg border border-gray-700">
        <MapContainer center={position || DEFAULT_CENTER} zoom={16} scrollWheelZoom className="h-full w-full">
          <ClickHandler onPick={handlePick} />
          <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>
      <p className="text-xs text-gray-400">
        Click on the map to select the issue location.{isResolving ? ' Resolving address…' : ''}
      </p>
    </div>
  );
}

