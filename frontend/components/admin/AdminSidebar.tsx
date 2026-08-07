"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "▣" },
  { href: "/admin/users", label: "Kullanıcılar", icon: "◉" },
  { href: "/admin/analyses", label: "Analizler", icon: "◇" },
];

function WingLogo() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-[2px]">
          {[18, 24, 30, 36].map((width) => (
            <span
              key={`l-${width}`}
              style={{ width }}
              className="h-px -skew-y-6 bg-[#c8a96a]"
            />
          ))}
        </div>

        <span className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#c8a96a]/50 bg-[#c8a96a]/[0.06] text-sm font-black text-[#d6b77b] shadow-[0_0_28px_rgba(200,169,106,0.12)]">
          CV
        </span>

        <div className="flex items-center gap-[2px]">
          {[36, 30, 24, 18].map((width) => (
            <span
              key={`r-${width}`}
              style={{ width }}
              className="h-px skew-y-6 bg-[#c8a96a]"
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#f5f5f3]">
        CarVision <span className="text-[#d6b77b]">AI</span>
      </p>

      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#777873]">
        Yönetim Paneli
      </p>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="border-b border-[#c8a96a]/15 bg-[#080808] lg:min-h-screen lg:w-72 lg:flex-none lg:border-b-0 lg:border-r">
      <div className="px-5 py-8">
        <Link href="/admin" prefetch className="block">
          <WingLogo />
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-5 lg:block lg:space-y-2">
        {links.map((link) => {
          const active = isActive(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 min-w-max items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition duration-300 lg:w-full ${
                active
                  ? "border-[#c8a96a]/35 bg-[#c8a96a]/[0.07] text-[#e2c88f] shadow-[0_12px_35px_rgba(200,169,106,0.08)]"
                  : "border-transparent text-[#b6b6b2] hover:border-white/[0.07] hover:bg-white/[0.025] hover:text-[#f5f5f3] active:scale-[0.98]"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs ${
                  active
                    ? "border-[#c8a96a]/30 bg-[#c8a96a]/[0.06] text-[#d6b77b]"
                    : "border-white/[0.07] bg-white/[0.02] text-[#777873]"
                }`}
              >
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}