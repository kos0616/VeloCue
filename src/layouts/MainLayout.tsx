import { ReactNode } from "react";

export default function MainLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent text-stone-900">
      <main className="relative flex-1">{children}</main>
    </div>
  );
}
