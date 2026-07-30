import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/admin/requireAdmin";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      <AdminSidebar />

      <div className="min-w-0 flex-1">
        <header className="border-b border-white/10 bg-slate-950/60 px-6 py-4 backdrop-blur">
          <p className="text-sm text-slate-400">
            CarVision AI yönetim alanı
          </p>
        </header>

        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}