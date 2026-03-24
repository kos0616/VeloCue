import { clsx } from "clsx";
import { ChevronRight } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";

const marketingLinks = [
  { label: "ABOUT", href: "#product" },
  { label: "使用情境", href: "#scenarios" },
  { label: "使用步驟", href: "#method" },
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
            <span className="text-[11px] text-stone-500">
              市民競賽前的策略筆記
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {isHome &&
            marketingLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
              >
                {item.label}
              </a>
            ))}

          {!isHome && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  clsx(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-stone-900"
                      : "text-stone-600 hover:text-stone-900",
                  )
                }
              >
                首頁
              </NavLink>
              <span className="text-sm text-stone-300">/</span>
              <span className="text-sm font-medium text-stone-900">
                編輯器
              </span>
            </>
          )}

          <Link
            to="/editor"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#17130f] bg-[#d93b33] px-4 py-2 text-sm font-semibold text-[#fff7f1] transition-transform hover:-translate-y-0.5"
          >
            打開編輯器
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <Link
          to="/editor"
          className="inline-flex items-center rounded-full border-2 border-[#17130f] bg-[#d93b33] px-3 py-2 text-sm font-semibold text-[#fff7f1] md:hidden"
        >
          編輯器
        </Link>
      </div>
    </header>
  );
}
