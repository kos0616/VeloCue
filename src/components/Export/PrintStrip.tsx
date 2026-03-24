import { useRouteStore } from "@/store/routeStore";
import { analyzeRoute } from "@/utils/routeUtils";
import { useMemo, useRef } from "react";
import html2canvas from "html2canvas-pro";
import { nanoid } from "nanoid";

export default function PrintStrip() {
  const gpxData = useRouteStore((state) => state.gpxData);
  const routePoints = useRouteStore((state) => state.routePoints);
  const userNotes = useRouteStore((state) => state.userNotes);
  const addUserNote = useRouteStore((state) => state.addUserNote);
  const updateUserNote = useRouteStore((state) => state.updateUserNote);
  const removeUserNote = useRouteStore((state) => state.removeUserNote);
  const stripRef = useRef<HTMLTableElement>(null);

  const rows = useMemo(() => {
    if (!gpxData) return [];

    const points = routePoints.length ? routePoints : analyzeRoute(gpxData);
    return userNotes
      .map((note) => {
        const closest = points.reduce(
          (prev, curr) => {
            return Math.abs(curr.distance - note.distance) <
              Math.abs(prev.distance - note.distance)
              ? curr
              : prev;
          },
          points[0] || { gradient: 0 },
        );

        const fallbackGrade = `${Math.round(closest?.gradient ?? 0)}%`;

        return {
          ...note,
          displayDistanceKm: Number((note.distance / 1000).toFixed(1)),
          gradeText: note.gradeText || fallbackGrade,
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }, [gpxData, routePoints, userNotes]);

  const handleAddEmptyRow = () => {
    addUserNote({
      id: nanoid(),
      distance: 0,
      gradeText: "0%",
      text: "",
    });
  };

  const handleDistanceChange = (id: string, kmValue: string) => {
    const nextKm = Number(kmValue);
    if (!Number.isFinite(nextKm) || nextKm < 0) return;
    const note = userNotes.find((n) => n.id === id);
    if (!note) return;
    updateUserNote({ ...note, distance: nextKm * 1000 });
  };

  const handleGradeChange = (id: string, value: string) => {
    const note = userNotes.find((n) => n.id === id);
    if (!note) return;
    updateUserNote({ ...note, gradeText: value });
  };

  const handleTextChange = (id: string, value: string) => {
    const note = userNotes.find((n) => n.id === id);
    if (!note) return;
    updateUserNote({ ...note, text: value });
  };

  const handleDeleteRow = (id: string) => {
    if (confirm("確定要刪除這列嗎？")) {
      removeUserNote(id);
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
          className="mb-5 w-full table-fixed border border-collapse border-gray-300 text-sm"
        >
          <tbody>
            {rows.map((row) => {
              return (
                <tr key={row.id} className="border-b border-gray-300">
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={row.displayDistanceKm}
                      onChange={(e) => handleDistanceChange(row.id, e.target.value)}
                      className="w-full bg-white px-2 py-2 text-right outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="text"
                      value={row.gradeText}
                      onChange={(e) => handleGradeChange(row.id, e.target.value)}
                      className="w-full bg-white px-2 py-2 outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="text"
                      value={row.text}
                      onChange={(e) => handleTextChange(row.id, e.target.value)}
                      className="w-full bg-white px-2 py-2 outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-0 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="w-full px-2 py-2 text-xs text-red-700 hover:bg-red-100"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={4} className="border border-gray-300 p-0">
                <button
                  type="button"
                  onClick={handleAddEmptyRow}
                  className="w-full border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  新增
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
