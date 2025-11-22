import { ReactNode } from "react";

export default function MainLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-col bg-slate-50 text-slate-900">
      <main className="relative flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
