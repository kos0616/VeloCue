import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen flex-col bg-slate-50 text-slate-900">
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600">VeloCue</span>
          <span className="text-xs text-slate-500">Cycle Notes Generator</span>
        </div>
        <nav className="flex gap-4">
          <a
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            Home
          </a>
          <a
            href="/editor"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            Editor
          </a>
        </nav>
      </header>
      <main className="relative flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
