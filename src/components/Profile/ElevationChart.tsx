import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { useRouteStore } from "@/store/routeStore";
import { nanoid } from "nanoid";
import { CategoricalChartFunc } from "recharts/types/chart/types";
import { findClosestPointIndexByDistance } from "@/utils/routeUtils";

function getGradientColor(gradient: number) {
  if (gradient > 12) return "#7f1d1d"; // Deep red
  if (gradient >= 9) return "#dc2626"; // Red
  if (gradient >= 6) return "#f97316"; // Orange
  if (gradient >= 3) return "#eab308"; // Yellow
  return "#16a34a"; // Green
}

function smoothGradient(points: { gradient: number }[], index: number, radius = 2) {
  const start = Math.max(0, index - radius);
  const end = Math.min(points.length - 1, index + radius);

  let sum = 0;
  let count = 0;

  for (let i = start; i <= end; i++) {
    sum += points[i].gradient;
    count += 1;
  }

  return count > 0 ? sum / count : points[index].gradient;
}

function DistanceOnlyTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ payload?: { gradient?: number } }>;
}) {
  if (!active || label === undefined) return null;

  const distance = Number(label);
  if (!Number.isFinite(distance)) return null;
  const gradient = payload?.[0]?.payload?.gradient;
  const gradientText =
    typeof gradient === "number" && Number.isFinite(gradient)
      ? `${Math.round(gradient)}%`
      : "-";

  return (
    <div className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm">
      {(distance / 1000).toFixed(2)}km | {gradientText}
    </div>
  );
}

export default function ElevationChart() {
  const routePoints = useRouteStore((state) => state.routePoints);
  const userNotes = useRouteStore((state) => state.userNotes);
  const addUserNote = useRouteStore((state) => state.addUserNote);
  const hoveredPointIndex = useRouteStore((state) => state.hoveredPointIndex);
  const setHoveredPointIndex = useRouteStore((state) => state.setHoveredPointIndex);

  const handleChartClick: CategoricalChartFunc = (e) => {
    if (e && e.activeLabel !== undefined) {
      const distance = Number(e.activeLabel);
      const pointIndex = findClosestPointIndexByDistance(routePoints, distance);
      const point = routePoints[pointIndex];
      if (!point) return;

      addUserNote({
        id: nanoid(),
        distance: point.distance,
        gradeText: `${Math.round(point.gradient)}%`,
        text: "",
      });
    }
  };

  const handleMouseMove: CategoricalChartFunc = (e) => {
    if (!e || e.activeLabel === undefined) return;
    const distance = Number(e.activeLabel);
    const pointIndex = findClosestPointIndexByDistance(routePoints, distance);
    if (pointIndex >= 0) {
      setHoveredPointIndex(pointIndex);
    }
  };

  const { data, gradientStops } = useMemo(() => {
    if (!routePoints.length) return { data: [], gradientStops: [] };

    const chartData = routePoints.map((p) => ({
      distance: p.distance,
      elevation: Number(p.elevation.toFixed(0)),
      gradient: p.gradient,
    }));

    const totalDist = routePoints[routePoints.length - 1].distance || 1;
    type Segment = { startDistance: number; endDistance: number; color: string };
    const segments: Segment[] = [];

    for (let i = 0; i < chartData.length; i++) {
      const current = chartData[i];
      const next = chartData[i + 1] ?? current;
      const smoothed = smoothGradient(chartData, i);
      const color = getGradientColor(smoothed);
      const startDistance = current.distance;
      const endDistance = next.distance;

      const last = segments[segments.length - 1];
      if (last && last.color === color) {
        last.endDistance = endDistance;
      } else {
        segments.push({ startDistance, endDistance, color });
      }
    }

    const stops = segments.flatMap((segment, index) => {
      const startOffset = (segment.startDistance / totalDist) * 100;
      const endOffset = (segment.endDistance / totalDist) * 100;

      if (index === 0) {
        return [
          { offset: `${startOffset}%`, color: segment.color },
          { offset: `${endOffset}%`, color: segment.color },
        ];
      }

      return [
        { offset: `${startOffset}%`, color: segment.color },
        { offset: `${endOffset}%`, color: segment.color },
      ];
    });

    return { data: chartData, gradientStops: stops };
  }, [routePoints]);

  if (!routePoints.length)
    return (
      <div className="p-4 text-center text-slate-500">
        Upload a GPX file to view elevation profile
      </div>
    );

  return (
    <div className="mt-4 h-full w-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-bold text-slate-700">
        Elevation Profile
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onClick={handleChartClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPointIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="distance"
            unit="km"
            minTickGap={50}
            tickFormatter={(value) => (value / 1000).toFixed(1)}
            type="number"
            domain={["dataMin", "dataMax"]}
          />
          <YAxis unit="m" domain={["dataMin - 10", "dataMax + 10"]} />
          <Tooltip content={<DistanceOnlyTooltip />} />
          <defs>
            <linearGradient id="gradeGradient" x1="0" y1="0" x2="1" y2="0">
              {gradientStops.map((stop, index) => (
                <stop
                  key={index}
                  offset={stop.offset}
                  stopColor={stop.color}
                  stopOpacity={1}
                />
              ))}
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="elevation"
            stroke="url(#gradeGradient)"
            fill="url(#gradeGradient)"
            fillOpacity={0.6}
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          {userNotes.map((note) => {
            const pointIndex = findClosestPointIndexByDistance(
              routePoints,
              note.distance,
            );
            const closestPoint = routePoints[pointIndex];

            return (
              <ReferenceDot
                key={note.id}
                x={note.distance}
                y={closestPoint ? Number(closestPoint.elevation) : 0}
                r={5}
                fill="red"
                stroke="white"
                ifOverflow="extendDomain"
              />
            );
          })}

          {hoveredPointIndex !== null && routePoints[hoveredPointIndex] && (
            <ReferenceDot
              x={routePoints[hoveredPointIndex].distance}
              y={routePoints[hoveredPointIndex].elevation}
              r={6}
              fill="#0f766e"
              stroke="white"
              ifOverflow="extendDomain"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
