export default function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-indigo-600">VeloCue</span>
        <span className="text-xs text-slate-500">Cycle Notes Generator</span>
      </div>
    </header>
  );
}
