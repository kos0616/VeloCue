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

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function getGradientColor(gradient: number) {
  if (gradient >= 15) return "#a855f7"; // Purple
  if (gradient >= 10) return "#ef4444"; // Red
  if (gradient >= 7) return "#f97316"; // Orange
  if (gradient >= 3) return "#eab308"; // Yellow
  return "#10b981"; // Green
}

export default function ElevationChart() {
  const gpxData = useRouteStore((state) => state.gpxData);
  const addUserNote = useRouteStore((state) => state.addUserNote);
  const userNotes = useRouteStore((state) => state.userNotes);

  const handleChartClick = (e: any) => {
    if (e && e.activePayload && e.activePayload.length > 0) {
      const payload = e.activePayload[0].payload;
      const distance = payload.distance;
      // const elevation = payload.elevation;

      // Simple prompt for now (replace with modal later)
      const text = prompt(`Add note at ${payload.displayDist}km?`);
      if (text) {
        addUserNote({
          id: nanoid(),
          distance: distance,
          text: text,
          type: "other",
        });
      }
    }
  };

  const { data, gradientStops } = useMemo(() => {
    if (!gpxData) return { data: [], gradientStops: [] };

    const coords = gpxData.features[0].geometry.coordinates;
    let totalDist = 0;
    const chartData = [];

    // First pass: calculate total distance and data points
    for (let i = 0; i < coords.length; i++) {
      const [lon, lat, ele] = coords[i];
      let dist = 0;

      if (i > 0) {
        const [prevLon, prevLat] = coords[i - 1];
        dist = getDistance(prevLat, prevLon, lat, lon);
        totalDist += dist;
      }

      let gradient = 0;
      if (i > 0 && dist > 0) {
        const prevEle = coords[i - 1][2];
        gradient = ((ele - prevEle) / dist) * 100;
      }

      chartData.push({
        distance: totalDist, // keep in meters for precision
        displayDist: (totalDist / 1000).toFixed(1),
        elevation: (ele || 0).toFixed(),
        gradient: gradient,
      });
    }

    const maxEle = Math.max(...chartData.map((d) => d.elevation));
    const minEle = Math.min(...chartData.map((d) => d.elevation));
    console.log("Chart Data Stats:", {
      totalPoints: chartData.length,
      totalDist: totalDist,
      maxEle,
      minEle,
      firstPoint: chartData[0],
      lastPoint: chartData[chartData.length - 1],
    });

    // Second pass: generate gradient stops
    const stops = chartData.map((point) => {
      const offset = (point.distance / totalDist) * 100;
      return {
        offset: `${offset}%`,
        color: getGradientColor(point.gradient),
      };
    });

    return { data: chartData, gradientStops: stops };
  }, [gpxData]);

  if (!gpxData)
    return (
      <div className="p-4 text-center text-slate-500">
        Upload a GPX file to view elevation profile
      </div>
    );

  return (
    <div className="h-full w-full bg-white p-4 rounded-lg shadow-sm border border-slate-200 mt-4">
      <h3 className="text-sm font-bold text-slate-700 mb-2">
        Elevation Profile
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onClick={handleChartClick}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="displayDist" unit="km" minTickGap={50} />
          <YAxis unit="m" domain={["dataMin - 10", "dataMax + 10"]} />
          <Tooltip />
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
          {userNotes.map((note) => (
            <ReferenceDot
              key={note.id}
              x={(note.distance / 1000).toFixed(2)}
              y={
                data.find((d) => Math.abs(d.distance - note.distance) < 50)
                  ?.elevation
              }
              r={5}
              fill="red"
              stroke="white"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
