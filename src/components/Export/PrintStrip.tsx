import { useRouteStore } from "@/store/routeStore";
import { analyzeRoute } from "@/utils/routeUtils";
import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import EditDialog from "@/components/EditDialog/index";

export default function PrintStrip() {
  const gpxData = useRouteStore((state) => state.gpxData);
  const userNotes = useRouteStore((state) => state.userNotes);
  const stripRef = useRef<HTMLTableElement>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const segments = useMemo(() => {
    if (!gpxData) return [];

    // Use the new logic: climbs > 400m, +3% gradient changes
    // const climbPoints = detectClimbsForStrip(gpxData);
    const allPoints = analyzeRoute(gpxData);

    // Also include user notes
    // ...climbPoints
    const pointsWithNotes: {
      distance: number;
      gradient: number;
      isStart: boolean;
    }[] = [];

    // Add user notes if they are not close to existing climb points
    userNotes.forEach((note) => {
      const exists = pointsWithNotes.some(
        (p) => Math.abs(p.distance - note.distance) < 100,
      );
      if (!exists) {
        // Find the actual gradient at this point
        const closestPoint = allPoints.reduce((prev, curr) => {
          return Math.abs(curr.distance - note.distance) <
            Math.abs(prev.distance - note.distance)
            ? curr
            : prev;
        }, allPoints[0]);

        pointsWithNotes.push({
          distance: note.distance,
          gradient: closestPoint ? closestPoint.gradient : 0,
          isStart: false,
        });
      }
    });

    return pointsWithNotes.sort((a, b) => a.distance - b.distance);
  }, [gpxData, userNotes]);

  const handleTableRowClicked = (id: string) => {
    if (id) {
      setEditingNoteId(id);
    }
  };

  const handleExport = async () => {
    if (!stripRef.current) return;
    const canvas = await html2canvas(stripRef.current);
    const link = document.createElement("a");
    link.download = "velo-cue-strip.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!gpxData) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {editingNoteId && (
        <EditDialog
          noteId={editingNoteId}
          onClose={() => setEditingNoteId(null)}
        />
      )}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">預覽</h3>
        <button
          onClick={handleExport}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Download
        </button>
      </div>

      <div className="overflow-x-auto pb-4">
        {/* The Strip Container */}
        <table
          ref={stripRef}
          className="mb-5 table-auto border border-gray-600"
        >
          <tbody>
            {segments.map((point, i) => {
              const distKm = (point.distance / 1000).toFixed(1);
              const note = userNotes.find(
                (n) => Math.abs(n.distance - point.distance) < 100,
              );

              // Color coding
              let bgColor = "bg-white";
              let textColor = "text-slate-900";
              if (point.gradient >= 10) {
                bgColor = "bg-purple-600";
                textColor = "text-white";
              } else if (point.gradient >= 7) {
                bgColor = "bg-red-500";
                textColor = "text-white";
              } else if (point.gradient >= 5) {
                bgColor = "bg-orange-400";
                textColor = "text-white";
              } else if (point.gradient >= 3) {
                bgColor = "bg-yellow-300";
                textColor = "text-slate-900";
              } else {
                bgColor = "bg-green-100";
              }

              // If it's just a user note without significant gradient, keep it white/neutral
              if (point.gradient < 3 && !note) {
                bgColor = "bg-white";
              }

              return (
                <tr
                  onClick={() => handleTableRowClicked(note?.id || "")}
                  key={i}
                  className={`text-xs ${bgColor} ${textColor} cursor-pointer border-b border-gray-600 hover:brightness-90`}
                  role="button"
                  title="編輯"
                >
                  <th className="py-0.5 pl-1 text-end whitespace-nowrap">
                    {distKm}
                    <span className="pl-0.5">㎞</span>
                  </th>
                  <td className="pl-1 text-end whitespace-nowrap">
                    {Math.round(point.gradient)}%
                  </td>
                  <td className="px-1">{note?.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
