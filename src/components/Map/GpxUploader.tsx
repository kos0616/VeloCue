import { ChangeEvent } from "react";
import { useRouteStore } from "@/store/routeStore";
// @ts-ignore
import toGeoJSON from "togeojson";
import testMapRaw from "@/assets/testmap.gpx?raw";

export default function GpxUploader() {
  const setGpxData = useRouteStore((state) => state.setGpxData);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        const parser = new DOMParser();
        const gpx = parser.parseFromString(text, "text/xml");
        const geoJson = toGeoJSON.gpx(gpx);
        console.log("Parsed GPX:", geoJson);
        if (!geoJson || !geoJson.features || geoJson.features.length === 0) {
          console.error("GPX parsing failed or empty features");
          alert("Error parsing GPX file. Please check console.");
        }
        setGpxData(geoJson);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadTestData = () => {
    const parser = new DOMParser();
    const gpx = parser.parseFromString(testMapRaw, "text/xml");
    const geoJson = toGeoJSON.gpx(gpx);
    console.log("Loaded Test Data:", geoJson);
    setGpxData(geoJson);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Upload GPX File
      </label>
      <input
        type="file"
        accept=".gpx"
        onChange={handleFileUpload}
        className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
      />
      <div className="mt-2 text-center">
        <span className="text-xs text-slate-400">- or -</span>
      </div>
      <button
        onClick={handleLoadTestData}
        className="mt-2 w-full rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
      >
        Load Test Data
      </button>
    </div>
  );
}
