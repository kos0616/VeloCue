import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { useRouteStore } from '@/store/routeStore';
import 'leaflet/dist/leaflet.css';

// Helper to fit bounds
function MapUpdater({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      map.fitBounds(coords);
    }
  }, [coords, map]);
  return null;
}

export default function RouteMap() {
  const gpxData = useRouteStore((state) => state.gpxData);
  
  // Extract coordinates from GeoJSON
  const coordinates = gpxData?.features?.[0]?.geometry?.coordinates?.map((coord: number[]) => [coord[1], coord[0]]) as [number, number][] || [];

  return (
    <div className="h-full w-full z-0">
      <MapContainer
        center={[23.5, 121]}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates.length > 0 && (
          <>
            <Polyline positions={coordinates} color="blue" />
            <MapUpdater coords={coordinates} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
