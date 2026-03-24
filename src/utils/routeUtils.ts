export interface RoutePoint {
  index: number;
  lat: number;
  lon: number;
  elevation: number;
  distance: number; // meters from route start
  gradient: number; // %
}

export interface DetectedClimb {
  startDistance: number;
  avgGradient: number;
  lengthMeters: number;
  score: number;
}

export function analyzeRoute(gpxData: any): RoutePoint[] {
  if (!gpxData?.features?.[0]?.geometry?.coordinates) return [];

  const coords = gpxData.features[0].geometry.coordinates;
  let totalDist = 0;
  const points: RoutePoint[] = [];

  for (let i = 0; i < coords.length; i++) {
    const [lon, lat, rawEle] = coords[i] as [number, number, number];
    const ele = Number.isFinite(rawEle) ? rawEle : 0;

    let segmentDist = 0;
    let gradient = 0;

    if (i > 0) {
      const [prevLon, prevLat, prevRawEle] = coords[i - 1] as [
        number,
        number,
        number,
      ];
      const prevEle = Number.isFinite(prevRawEle) ? prevRawEle : 0;
      segmentDist = getDistance(prevLat, prevLon, lat, lon);
      totalDist += segmentDist;

      if (segmentDist > 0) {
        gradient = ((ele - prevEle) / segmentDist) * 100;
      }
    }

    points.push({
      index: i,
      lat,
      lon,
      elevation: ele,
      distance: totalDist,
      gradient,
    });
  }

  return points;
}

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

export function detectClimbsByScore(
  points: RoutePoint[],
  scoreThreshold = 1500,
): DetectedClimb[] {
  if (!points.length) return [];

  const climbs: DetectedClimb[] = [];
  let start = -1;

  const closeAndPush = (end: number) => {
    if (start < 0 || end <= start) return;

    const startPoint = points[start];
    const endPoint = points[end];
    const lengthMeters = endPoint.distance - startPoint.distance;
    if (lengthMeters < 500) return;

    const segment = points.slice(start, end + 1);
    const avgGradient =
      segment.reduce((sum, p) => sum + Math.max(0, p.gradient), 0) /
      segment.length;

    if (avgGradient < 3) return;

    const score = lengthMeters * avgGradient;
    if (score < scoreThreshold) return;

    climbs.push({
      startDistance: startPoint.distance,
      avgGradient,
      lengthMeters,
      score,
    });
  };

  for (let i = 0; i < points.length; i++) {
    const isClimbing = points[i].gradient >= 3;

    if (isClimbing && start === -1) {
      start = i;
      continue;
    }

    if (!isClimbing && start !== -1) {
      closeAndPush(i - 1);
      start = -1;
    }
  }

  if (start !== -1) {
    closeAndPush(points.length - 1);
  }

  return climbs;
}

export function findClosestPointIndexByDistance(
  points: RoutePoint[],
  targetDistance: number,
): number {
  if (!points.length) return -1;
  let bestIndex = 0;
  let bestDiff = Math.abs(points[0].distance - targetDistance);

  for (let i = 1; i < points.length; i++) {
    const diff = Math.abs(points[i].distance - targetDistance);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i;
    }
  }

  return bestIndex;
}

export function findClosestPointIndexByLatLng(
  points: RoutePoint[],
  lat: number,
  lon: number,
): number {
  if (!points.length) return -1;

  let bestIndex = 0;
  let bestDist = Number.POSITIVE_INFINITY;

  for (let i = 0; i < points.length; i++) {
    const d = getDistance(lat, lon, points[i].lat, points[i].lon);
    if (d < bestDist) {
      bestDist = d;
      bestIndex = i;
    }
  }

  return bestIndex;
}
