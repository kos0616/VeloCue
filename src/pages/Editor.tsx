import { useEffect } from "react";
import RouteMap from "@/components/Map/RouteMap";
import GpxUploader from "@/components/Map/GpxUploader";
import ElevationChart from "@/components/Profile/ElevationChart";
import { useRouteStore } from "@/store/routeStore";
import { analyzeRoute, detectClimbsByScore } from "@/utils/routeUtils";
import PrintStrip from "@/components/Export/PrintStrip";
import { nanoid } from "nanoid";

export default function Editor() {
  const gpxData = useRouteStore((state) => state.gpxData);
  const setRoutePoints = useRouteStore((state) => state.setRoutePoints);
  const clearUserNotes = useRouteStore((state) => state.clearUserNotes);
  const addUserNotes = useRouteStore((state) => state.addUserNotes);

  useEffect(() => {
    if (!gpxData) {
      setRoutePoints([]);
      clearUserNotes();
      return;
    }

    const points = analyzeRoute(gpxData);
    setRoutePoints(points);

    const climbs = detectClimbsByScore(points, 1500);
    const autoNotes = climbs.map((climb) => {
      const gradient = Math.round(climb.avgGradient);
      const lengthMeters = Math.round(climb.lengthMeters);

      return {
        id: nanoid(),
        distance: climb.startDistance,
        gradeText: `${gradient}%`,
        text: `${lengthMeters}m`,
      };
    });

    clearUserNotes();
    addUserNotes(autoNotes);
  }, [gpxData, setRoutePoints, clearUserNotes, addUserNotes]);

  return (
    <div className="flex h-full flex-1 flex-col lg:flex-row">
      {/* Sidebar / Control Panel */}
      <div className="relative z-10 w-full overflow-y-auto border-r border-slate-200 bg-white p-4 lg:w-[500px] lg:shrink-0">
        <h2 className="mb-4 text-lg font-bold">Route Editor</h2>

        {!gpxData && <GpxUploader />}
        {!gpxData && (
          <p className="mt-2 text-sm text-slate-500">
            Upload a GPX file to see the route and elevation profile.
          </p>
        )}

        <div className="mb-2">
          {gpxData && (
            <p className="text-xs text-green-600">
              GPX 讀取成功! 總計{" "}
              {gpxData.features?.[0]?.geometry?.coordinates?.length}
              個點位
            </p>
          )}
        </div>
        <PrintStrip />
      </div>

      {/* Map Area */}
      <div className="relative flex flex-1 flex-col">
        <div className="relative flex-1">
          <RouteMap />
        </div>
        <div className="z-10 flex h-1/2 flex-col gap-4 overflow-y-auto border-t border-slate-200 bg-slate-50 p-2">
          <div className="h-64 shrink-0">
            <ElevationChart />
          </div>
        </div>
      </div>
    </div>
  );
}
