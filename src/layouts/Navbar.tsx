import { ChevronRight, ChevronLeft } from "lucide-react";
import { Link, useLocation } from "react-router";

const marketingLinks = [
  { label: "Why", href: "#WHY" },
  { label: "When", href: "#WHEN" },
  { label: "How", href: "#HOW" },
];

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-[#cfd4cc] bg-[#f7f4ed]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border-2 border-[#17130f] bg-[#7ea445] text-sm font-black text-[#17130f] shadow-sm">
            VC
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-black tracking-tight text-stone-900">
              VELOCUE
            </span>
            <span className="text-[12px] text-stone-500">Note Before Race</span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {isHome ? (
            <>
              {marketingLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/editor"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-gray-800 bg-green-700 px-4 py-2 text-sm font-semibold text-white"
              >
                START
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="group inline-flex items-center font-medium text-nowrap text-stone-600 transition-colors hover:text-stone-900"
              >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                BACK
              </Link>
            </>
          )}
        </div>

        <Link
          to="/editor"
          className="inline-flex items-center rounded-full border-2 border-gray-800 bg-red-500 px-3 py-2 text-sm font-semibold text-white md:hidden"
        >
          編輯器
        </Link>
      </div>
    </header>
  );
}
