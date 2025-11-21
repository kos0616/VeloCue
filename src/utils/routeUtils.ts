import { UserNote } from "@/store/routeStore";
import { nanoid } from "nanoid";

export function analyzeRoute(gpxData: any): { distance: number; elevation: number; gradient: number }[] {
  if (!gpxData) return [];
  const coords = gpxData.features[0].geometry.coordinates;
  let totalDist = 0;
  const points = [];

  for (let i = 0; i < coords.length; i++) {
    const [lon, lat, ele] = coords[i];
    let dist = 0;
    let gradient = 0;

    if (i > 0) {
      const [prevLon, prevLat, prevEle] = coords[i - 1];
      dist = getDistance(prevLat, prevLon, lat, lon);
      totalDist += dist;
      
      if (dist > 0) {
        gradient = ((ele - prevEle) / dist) * 100;
      }
    }

    points.push({
      distance: totalDist,
      elevation: ele,
      gradient: gradient
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

export function detectSteepSections(gpxData: any, threshold = 10): UserNote[] {
    const points = analyzeRoute(gpxData);
    const notes: UserNote[] = [];
    let inSteepSection = false;
    let maxGradientInCurrentSection = 0;
    let sectionStartDist = 0;

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.gradient >= threshold) {
            if (!inSteepSection) {
                inSteepSection = true;
                sectionStartDist = p.distance;
                maxGradientInCurrentSection = p.gradient;
            } else {
                maxGradientInCurrentSection = Math.max(maxGradientInCurrentSection, p.gradient);
            }
        } else {
            if (inSteepSection) {
                // End of steep section
                // Only add if section is long enough (e.g., > 50m) to avoid noise
                if (p.distance - sectionStartDist > 50) {
                     notes.push({
                        id: nanoid(),
                        distance: sectionStartDist,
                        text: `Steep! Max ${maxGradientInCurrentSection.toFixed(1)}%`,
                        type: 'climb'
                    });
                }
                inSteepSection = false;
            }
        }
    }
    return notes;
}

export function detectClimbsForStrip(gpxData: any): { distance: number; gradient: number; isStart: boolean }[] {
    const points = analyzeRoute(gpxData);
    const result: { distance: number; gradient: number; isStart: boolean }[] = [];
    
    let climbStartDist = -1;
    let climbStartGradient = 0;
    let lastMarkedGradient = 0;
    let currentClimbDuration = 0; // distance in meters

    // Smoothing: use moving average for gradient to avoid noise
    const smoothedPoints = points.map((p, i) => {
        const window = points.slice(Math.max(0, i - 2), Math.min(points.length, i + 3));
        const avgGrad = window.reduce((sum, wp) => sum + wp.gradient, 0) / window.length;
        return { ...p, gradient: avgGrad };
    });

    for (let i = 0; i < smoothedPoints.length; i++) {
        const p = smoothedPoints[i];
        
        // Start of a climb (gradient > 2%)
        if (p.gradient > 2) {
            if (climbStartDist === -1) {
                climbStartDist = p.distance;
                climbStartGradient = p.gradient;
                lastMarkedGradient = p.gradient;
                currentClimbDuration = 0;
            } else {
                currentClimbDuration = p.distance - climbStartDist;
                
                // If climb is long enough (> 400m), mark the start if not already marked
                if (currentClimbDuration > 400) {
                     const startPointAlreadyMarked = result.some(r => Math.abs(r.distance - climbStartDist) < 100);
                     if (!startPointAlreadyMarked) {
                         result.push({ distance: climbStartDist, gradient: climbStartGradient, isStart: true });
                     }

                     // Check for significant gradient increase (+3%)
                     if (p.gradient >= lastMarkedGradient + 3) {
                         result.push({ distance: p.distance, gradient: p.gradient, isStart: false });
                         lastMarkedGradient = p.gradient;
                     }
                }
            }
        } else {
            // End of climb
            climbStartDist = -1;
            currentClimbDuration = 0;
        }
    }
    
    return result.sort((a, b) => a.distance - b.distance);
}
