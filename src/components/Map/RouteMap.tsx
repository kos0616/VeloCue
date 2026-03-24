import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import L, { LeafletMouseEvent } from "leaflet";
import { useRouteStore } from "@/store/routeStore";
import { nanoid } from "nanoid";
import {
  findClosestPointIndexByLatLng,
  findClosestPointIndexByDistance,
} from "@/utils/routeUtils";
import "leaflet/dist/leaflet.css";

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
  const routePoints = useRouteStore((state) => state.routePoints);
  const userNotes = useRouteStore((state) => state.userNotes);
  const addUserNote = useRouteStore((state) => state.addUserNote);
  const hoveredPointIndex = useRouteStore((state) => state.hoveredPointIndex);
  const setHoveredPointIndex = useRouteStore((state) => state.setHoveredPointIndex);

  const coordinates = useMemo(
    () =>
      (gpxData?.features?.[0]?.geometry?.coordinates?.map((coord: number[]) => [
        coord[1],
        coord[0],
      ]) as [number, number][]) || [],
    [gpxData],
  );

  const startPoint = coordinates[0] || null;

  const hoveredLatLng = useMemo(() => {
    if (hoveredPointIndex === null || hoveredPointIndex < 0) return null;
    const p = routePoints[hoveredPointIndex];
    if (!p) return null;
    return [p.lat, p.lon] as [number, number];
  }, [hoveredPointIndex, routePoints]);

  const hoveredDistanceLabel = useMemo(() => {
    if (hoveredPointIndex === null || hoveredPointIndex < 0) return null;
    const p = routePoints[hoveredPointIndex];
    if (!p) return null;
    return `${(p.distance / 1000).toFixed(2)}km | ${Math.round(p.gradient)}%`;
  }, [hoveredPointIndex, routePoints]);

  const noteMarkerPositions = useMemo(() => {
    return userNotes
      .map((note) => {
        const pointIndex = findClosestPointIndexByDistance(routePoints, note.distance);
        const p = routePoints[pointIndex];
        if (!p) return null;
        return { id: note.id, lat: p.lat, lon: p.lon, label: note.text || note.gradeText };
      })
      .filter(Boolean) as Array<{ id: string; lat: number; lon: number; label: string }>;
  }, [routePoints, userNotes]);

  const startIcon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: '<div style="width:14px;height:14px;border-radius:9999px;background:#16a34a;border:2px solid #fff;box-shadow:0 0 0 2px #14532d"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      }),
    [],
  );

  const handleRouteHover = (e: LeafletMouseEvent) => {
    if (!routePoints.length) return;
    const closestIndex = findClosestPointIndexByLatLng(
      routePoints,
      e.latlng.lat,
      e.latlng.lng,
    );
    if (closestIndex >= 0) {
      setHoveredPointIndex(closestIndex);
    }
  };

  const handleRouteClick = (e: LeafletMouseEvent) => {
    if (!routePoints.length) return;

    const closestIndex = findClosestPointIndexByLatLng(
      routePoints,
      e.latlng.lat,
      e.latlng.lng,
    );

    const point = routePoints[closestIndex];
    if (!point) return;

    addUserNote({
      id: nanoid(),
      distance: point.distance,
      gradeText: `${Math.round(point.gradient)}%`,
      text: "",
    });
  };

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
            <Polyline
              positions={coordinates}
              color="#1d4ed8"
              weight={5}
              interactive={false}
            />
            <Polyline
              positions={coordinates}
              color="#1d4ed8"
              weight={20}
              opacity={0}
              eventHandlers={{
                mousemove: handleRouteHover,
                click: handleRouteClick,
                mouseout: () => setHoveredPointIndex(null),
              }}
            />
            <MapUpdater coords={coordinates} />

            {startPoint && (
              <Marker position={startPoint} icon={startIcon}>
                <Tooltip direction="top" offset={[0, -6]} permanent>
                  Start
                </Tooltip>
              </Marker>
            )}

            {hoveredLatLng && (
              <CircleMarker
                center={hoveredLatLng}
                radius={7}
                interactive={false}
                pathOptions={{ color: "#0f766e", fillColor: "#14b8a6", fillOpacity: 0.9 }}
              >
                {hoveredDistanceLabel && (
                  <Tooltip direction="top" offset={[0, -8]} permanent>
                    {hoveredDistanceLabel}
                  </Tooltip>
                )}
              </CircleMarker>
            )}

            {noteMarkerPositions.map((m) => (
              <CircleMarker
                key={m.id}
                center={[m.lat, m.lon]}
                radius={5}
                pathOptions={{ color: "#7f1d1d", fillColor: "#ef4444", fillOpacity: 0.9 }}
              >
                <Tooltip direction="top" offset={[0, -6]}>
                  {m.label || "Note"}
                </Tooltip>
              </CircleMarker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
}
