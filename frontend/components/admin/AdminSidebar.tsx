import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Kullanıcılar" },
  { href: "/admin/analyses", label: "Analizler" },
];

export function AdminSidebar() {
  return (
    <aside className="border-b border-white/10 bg-slate-950/70 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="p-6">
        <Link href="/admin" className="text-xl font-bold text-white">
          CarVision AI
        </Link>

        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
          Yönetim Paneli
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}