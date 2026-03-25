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

const MIN_CLIMB_BLOCK_METERS = 100;
const MERGE_CLIMB_GAP_METERS = 600;
const SHORT_DOWNHILL_GAP_METERS = 150;
const SMOOTH_WINDOW_RADIUS = 2;
const STABLE_CLIMB_MIN_METERS = 400;
const STABLE_CLIMB_ENTRY_GRADIENT = 1.5;
const STABLE_CLIMB_KEEP_GRADIENT = 0.6;
const STRIPE_MERGE_MAX_METERS = 120;

function getGradientColor(gradient: number) {
  if (gradient > 12) return "#7f1d1d"; // Deep red
  if (gradient >= 9) return "#dc2626"; // Red
  if (gradient >= 6) return "#f97316"; // Orange
  if (gradient >= 3) return "#eab308"; // Yellow
  return "#16a34a"; // Green
}

function getGradientLevel(gradient: number) {
  if (gradient > 12) return 4;
  if (gradient >= 9) return 3;
  if (gradient >= 6) return 2;
  if (gradient >= 3) return 1;
  return 0;
}

function getColorByLevel(level: number) {
  if (level >= 4) return "#7f1d1d";
  if (level === 3) return "#dc2626";
  if (level === 2) return "#f97316";
  if (level === 1) return "#eab308";
  return "#16a34a";
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
    if (chartData.length < 2) {
      return {
        data: chartData,
        gradientStops: [
          { offset: "0%", color: getGradientColor(chartData[0]?.gradient ?? 0) },
          { offset: "100%", color: getGradientColor(chartData[0]?.gradient ?? 0) },
        ],
      };
    }

    const segmentCount = chartData.length - 1;
    const segmentStartDistances: number[] = [];
    const segmentEndDistances: number[] = [];
    const segmentLengths: number[] = [];
    const rawGradients: number[] = [];

    for (let i = 0; i < segmentCount; i++) {
      const start = chartData[i].distance;
      const end = chartData[i + 1].distance;
      segmentStartDistances.push(start);
      segmentEndDistances.push(end);
      segmentLengths.push(Math.max(1, end - start));
      rawGradients.push((chartData[i].gradient + chartData[i + 1].gradient) / 2);
    }

    const smoothedGradients: number[] = rawGradients.map((_, i) => {
      const start = Math.max(0, i - SMOOTH_WINDOW_RADIUS);
      const end = Math.min(segmentCount - 1, i + SMOOTH_WINDOW_RADIUS);

      let weightedSum = 0;
      let weightedLength = 0;

      for (let j = start; j <= end; j++) {
        weightedSum += rawGradients[j] * segmentLengths[j];
        weightedLength += segmentLengths[j];
      }

      return weightedLength > 0 ? weightedSum / weightedLength : rawGradients[i];
    });

    const levels: number[] = smoothedGradients.map((g) => getGradientLevel(g));

    type Block = { start: number; end: number };
    const collectClimbBlocks = () => {
      const blocks: Block[] = [];
      let start = -1;

      for (let i = 0; i <= segmentCount; i++) {
        const isClimb = i < segmentCount && levels[i] > 0;
        if (isClimb && start === -1) {
          start = i;
        }

        if ((!isClimb || i === segmentCount) && start !== -1) {
          blocks.push({ start, end: i - 1 });
          start = -1;
        }
      }

      return blocks;
    };

    const getBlockLength = (block: Block) => {
      let length = 0;
      for (let i = block.start; i <= block.end; i++) {
        length += segmentLengths[i];
      }
      return length;
    };

    // Rule 1: ignore tiny climbs (<= 100m) to reduce jitter-like stripes.
    const initialBlocks = collectClimbBlocks();
    initialBlocks.forEach((block) => {
      if (getBlockLength(block) <= MIN_CLIMB_BLOCK_METERS) {
        for (let i = block.start; i <= block.end; i++) {
          levels[i] = 0;
        }
      }
    });

    // Keep long climbs visually stable by assigning a minimum color level per climb block.
    let blockStart = -1;
    for (let i = 0; i <= segmentCount; i++) {
      const inClimb =
        i < segmentCount && smoothedGradients[i] >= STABLE_CLIMB_ENTRY_GRADIENT;
      if (inClimb && blockStart === -1) {
        blockStart = i;
      }

      if ((!inClimb || i === segmentCount) && blockStart !== -1) {
        const blockEnd = i - 1;

        let blockLength = 0;
        let positiveWeightedSum = 0;
        let positiveLength = 0;

        for (let j = blockStart; j <= blockEnd; j++) {
          blockLength += segmentLengths[j];
          if (smoothedGradients[j] > 0) {
            positiveWeightedSum += smoothedGradients[j] * segmentLengths[j];
            positiveLength += segmentLengths[j];
          }
        }

        if (blockLength >= STABLE_CLIMB_MIN_METERS && positiveLength > 0) {
          const blockAvgGradient = positiveWeightedSum / positiveLength;
          const blockLevel = getGradientLevel(blockAvgGradient);

          for (let j = blockStart; j <= blockEnd; j++) {
            if (smoothedGradients[j] > STABLE_CLIMB_KEEP_GRADIENT) {
              levels[j] = Math.max(levels[j], blockLevel);
            }
          }
        }

        blockStart = -1;
      }
    }

    // Rule 2: merge nearby climbs when the gap is <= 600m.
    const blocksAfterFilter = collectClimbBlocks();
    if (blocksAfterFilter.length > 1) {
      let groupStart = 0;

      const applyMergedGroupColor = (startIdx: number, endIdx: number) => {
        const first = blocksAfterFilter[startIdx];
        const last = blocksAfterFilter[endIdx];
        if (!first || !last || startIdx === endIdx) return;

        let positiveWeightedSum = 0;
        let positiveLength = 0;

        for (let i = first.start; i <= last.end; i++) {
          if (smoothedGradients[i] > 0) {
            positiveWeightedSum += smoothedGradients[i] * segmentLengths[i];
            positiveLength += segmentLengths[i];
          }
        }

        if (positiveLength === 0) return;

        const mergedLevel = getGradientLevel(positiveWeightedSum / positiveLength);
        for (let i = first.start; i <= last.end; i++) {
          levels[i] = Math.max(levels[i], mergedLevel);
        }
      };

      for (let i = 1; i < blocksAfterFilter.length; i++) {
        const prev = blocksAfterFilter[i - 1];
        const curr = blocksAfterFilter[i];
        const gapMeters =
          segmentStartDistances[curr.start] - segmentEndDistances[prev.end];

        if (gapMeters <= MERGE_CLIMB_GAP_METERS) {
          continue;
        }

        applyMergedGroupColor(groupStart, i - 1);
        groupStart = i;
      }

      applyMergedGroupColor(groupStart, blocksAfterFilter.length - 1);
    }

    // Rule 3: if a short downhill gap is sandwiched by climbs, fill it with climb color.
    for (let i = 1; i < segmentCount - 1; i++) {
      if (levels[i] !== 0) continue;

      const leftLevel = levels[i - 1];
      const rightLevel = levels[i + 1];
      if (leftLevel <= 0 || rightLevel <= 0) continue;

      let gapStart = i;
      let gapEnd = i;

      while (gapStart > 0 && levels[gapStart - 1] === 0) {
        gapStart--;
      }
      while (gapEnd < segmentCount - 1 && levels[gapEnd + 1] === 0) {
        gapEnd++;
      }

      const leftNeighbor = gapStart - 1;
      const rightNeighbor = gapEnd + 1;
      if (leftNeighbor < 0 || rightNeighbor >= segmentCount) continue;
      if (levels[leftNeighbor] <= 0 || levels[rightNeighbor] <= 0) continue;

      let gapLength = 0;
      for (let j = gapStart; j <= gapEnd; j++) {
        gapLength += segmentLengths[j];
      }

      if (gapLength <= SHORT_DOWNHILL_GAP_METERS) {
        const fillLevel = Math.max(levels[leftNeighbor], levels[rightNeighbor]);
        for (let j = gapStart; j <= gapEnd; j++) {
          levels[j] = fillLevel;
        }
      }

      i = gapEnd;
    }

    // Merge tiny spikes/dips to avoid fragmented stripes.
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 1; i < segmentCount - 1; i++) {
        const prev = levels[i - 1];
        const curr = levels[i];
        const next = levels[i + 1];

        if (
          prev === next &&
          curr !== prev &&
          segmentLengths[i] <= STRIPE_MERGE_MAX_METERS
        ) {
          levels[i] = prev;
        }
      }
    }

    type Segment = { startDistance: number; endDistance: number; level: number };
    const segments: Segment[] = [];

    for (let i = 0; i < segmentCount; i++) {
      const level = levels[i];
      const startDistance = segmentStartDistances[i];
      const endDistance = segmentEndDistances[i];
      const last = segments[segments.length - 1];

      if (last && last.level === level) {
        last.endDistance = endDistance;
      } else {
        segments.push({ startDistance, endDistance, level });
      }
    }

    const stops = segments.flatMap((segment) => {
      const startOffset = (segment.startDistance / totalDist) * 100;
      const endOffset = (segment.endDistance / totalDist) * 100;
      const color = getColorByLevel(segment.level);

      return [
        { offset: `${startOffset}%`, color },
        { offset: `${endOffset}%`, color },
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
