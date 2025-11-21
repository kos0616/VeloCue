import { useRouteStore } from '@/store/routeStore';
import { detectClimbsForStrip } from '@/utils/routeUtils';
import { useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function PrintStrip() {
  const gpxData = useRouteStore((state) => state.gpxData);
  const userNotes = useRouteStore((state) => state.userNotes);
  const stripRef = useRef<HTMLDivElement>(null);

  const segments = useMemo(() => {
    if (!gpxData) return [];
    
    // Use the new logic: climbs > 400m, +3% gradient changes
    const climbPoints = detectClimbsForStrip(gpxData);
    
    // Also include user notes
    const pointsWithNotes = [...climbPoints];
    
    // Add user notes if they are not close to existing climb points
    userNotes.forEach(note => {
        const exists = pointsWithNotes.some(p => Math.abs(p.distance - note.distance) < 100);
        if (!exists) {
            pointsWithNotes.push({ distance: note.distance, gradient: 0, isStart: false }); // Gradient 0 as placeholder, will be ignored for color if note exists
        }
    });

    return pointsWithNotes.sort((a, b) => a.distance - b.distance);
  }, [gpxData, userNotes]);

  const handleExport = async () => {
    if (!stripRef.current) return;
    const canvas = await html2canvas(stripRef.current);
    const link = document.createElement('a');
    link.download = 'velo-cue-strip.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!gpxData) return null;

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Stem Strip Preview (Climbs & Notes)</h3>
        <button 
            onClick={handleExport}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
            Download Image
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        {/* The Strip Container */}
        <div 
            ref={stripRef}
            className="flex flex-row bg-white border border-slate-900 min-w-max"
            style={{ height: '140px' }}
        >
            {segments.map((point, i) => {
                const distKm = (point.distance / 1000).toFixed(1);
                const note = userNotes.find(n => Math.abs(n.distance - point.distance) < 100);
                
                // Color coding
                let bgColor = 'bg-white';
                let textColor = 'text-slate-900';
                if (point.gradient >= 10) { bgColor = 'bg-purple-600'; textColor = 'text-white'; }
                else if (point.gradient >= 7) { bgColor = 'bg-red-500'; textColor = 'text-white'; }
                else if (point.gradient >= 5) { bgColor = 'bg-orange-400'; textColor = 'text-white'; }
                else if (point.gradient >= 3) { bgColor = 'bg-yellow-300'; textColor = 'text-slate-900'; }
                else { bgColor = 'bg-green-100'; }

                // If it's just a user note without significant gradient, keep it white/neutral
                if (point.gradient < 3 && !note) {
                     bgColor = 'bg-white';
                }

                return (
                    <div key={i} className={`flex flex-col justify-between items-center w-12 border-r border-slate-300 text-xs ${bgColor} ${textColor} p-1 relative`}>
                        <span className="font-bold transform -rotate-90 origin-center mt-4 whitespace-nowrap">{distKm}k</span>
                        
                        {note && (
                            <div className="absolute top-0 -mt-6 bg-blue-600 text-white text-[10px] p-1 rounded z-10 whitespace-nowrap shadow-md">
                                {note.text}
                                <div className="text-[9px] opacity-80">{distKm}km, {Math.round(point.gradient)}%</div>
                            </div>
                        )}

                        <span className="mb-1 font-bold">{Math.round(point.gradient)}%</span>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
}
