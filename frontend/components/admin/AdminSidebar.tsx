"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Kullanıcılar" },
  { href: "/admin/analyses", label: "Analizler" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="border-b border-white/10 bg-slate-950/70 lg:min-h-screen lg:w-64 lg:flex-none lg:border-b-0 lg:border-r">
      <div className="p-6">
        <Link
          href="/admin"
          prefetch
          className="inline-block text-xl font-bold text-white transition hover:text-emerald-300"
        >
          CarVision AI
        </Link>

        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
          Yönetim Paneli
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-2">
        {links.map((link) => {
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 min-w-max items-center rounded-xl border px-4 py-3 text-sm font-semibold transition lg:w-full ${
                active
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}