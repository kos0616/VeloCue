import RouteMap from '@/components/Map/RouteMap';
import GpxUploader from '@/components/Map/GpxUploader';
import ElevationChart from '@/components/Profile/ElevationChart';
import { useRouteStore } from '@/store/routeStore';
import { detectSteepSections } from '@/utils/routeUtils';
import PrintStrip from '@/components/Export/PrintStrip';

export default function Editor() {
  const gpxData = useRouteStore((state) => state.gpxData);
  const addUserNote = useRouteStore((state) => state.addUserNote);

  console.log('Editor Render, gpxData:', gpxData);

  const handleAutoTag = () => {
    if (!gpxData) return;
    const notes = detectSteepSections(gpxData, 8); // > 8%
    notes.forEach(note => addUserNote(note));
    alert(`Added ${notes.length} climb markers!`);
  };

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Sidebar / Control Panel */}
      <div className="w-full lg:w-[300px] lg:shrink-0 bg-white border-r border-slate-200 p-4 overflow-y-auto z-10 relative">
        <h2 className="text-lg font-bold mb-4">Route Editor</h2>
        <GpxUploader />
        
        {gpxData && (
          <div className="mt-4">
            <button
              onClick={handleAutoTag}
              className="w-full rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
            >
              Auto-Detect Climbs (&gt;8%)
            </button>
          </div>
        )}

        <div className="mt-8">
          <p className="text-slate-500 text-sm">
            Upload a GPX file to see the route and elevation profile.
          </p>
          {gpxData && (
             <p className="text-xs text-green-600 mt-2">
                GPX Loaded: {gpxData.features?.[0]?.geometry?.coordinates?.length} points
             </p>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative flex flex-col">
        <div className="flex-1 relative">
             <RouteMap />
        </div>
        <div className="h-1/2 bg-slate-50 p-2 border-t border-slate-200 z-10 overflow-y-auto flex flex-col gap-4 overflow-auto">
            <div className="h-64 shrink-0">
                <ElevationChart />
            </div>
            {/* <PrintStrip /> */}
        </div>
      </div>
    </div>
  );
}
