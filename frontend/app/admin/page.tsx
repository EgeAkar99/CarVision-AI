import Link from "next/link";

import { getAdminDashboardData } from "@/lib/admin/dashboard";
import { requireAdmin } from "@/lib/admin/requireAdmin";

const recommendationLabels: Record<string, string> = {
  strong_buy: "Güçlü Alım",
  buy: "Satın Alınabilir",
  consider: "Değerlendir",
  avoid: "Uzak Dur",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminPage() {
  await requireAdmin();
  const stats = await getAdminDashboardData();

  const cards = [
    { title: "Toplam Kullanıcı", value: stats.totalUsers, description: "Kayıtlı tüm hesaplar", icon: "◉" },
    { title: "Toplam Analiz", value: stats.totalAnalyses, description: "Tüm zamanlarda yapılan analizler", icon: "↗" },
    { title: "Bugünkü Analiz", value: stats.todayAnalyses, description: "Bugün tamamlanan işlemler", icon: "◷" },
    { title: "Aktif Kullanıcı", value: stats.activeUsers, description: "Son 30 günde giriş yapanlar", icon: "◎" },
  ];

  return (
    <main>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a96a]">
          Genel Bakış
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#f5f5f3]">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-[#8f918d]">
          Kullanıcıları, analizleri ve sistem istatistiklerini buradan yönet.
        </p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className="relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#101113] p-5 shadow-[0_22px_65px_rgba(0,0,0,0.25)]"
          >
            <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8a96a]/45 to-transparent" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#8f918d]">{card.title}</p>
                <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#f5f5f3]">
                  {card.value.toLocaleString("tr-TR")}
                </p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c8a96a]/25 bg-[#c8a96a]/[0.06] text-[#d6b77b]">
                {card.icon}
              </span>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#666762]">{card.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <article className="rounded-[24px] border border-white/[0.08] bg-[#101113] p-6 shadow-[0_24px_75px_rgba(0,0,0,0.24)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[#f5f5f3]">Son Kullanıcılar</h2>
            <Link href="/admin/users" className="text-sm font-semibold text-[#d6b77b] transition hover:text-[#e2c88f]">
              Tümünü Gör →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {stats.recentUsers.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="block rounded-xl border border-white/[0.07] bg-[#0b0c0e] p-4 transition hover:border-[#c8a96a]/25 hover:bg-[#0d0e10]"
              >
                <p className="truncate text-sm font-semibold text-[#f5f5f3]">{user.email}</p>
                <p className="mt-1 text-xs text-[#666762]">Kayıt: {formatDate(user.createdAt)}</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="rounded-[24px] border border-white/[0.08] bg-[#101113] p-6 shadow-[0_24px_75px_rgba(0,0,0,0.24)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[#f5f5f3]">Son Analizler</h2>
            <Link href="/admin/analyses" className="text-sm font-semibold text-[#d6b77b] transition hover:text-[#e2c88f]">
              Tümünü Gör →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {stats.recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="rounded-xl border border-white/[0.07] bg-[#0b0c0e] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#f5f5f3]">{analysis.brand} {analysis.model}</p>
                    <p className="mt-1 text-xs text-[#666762]">{formatDate(analysis.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#d6b77b]">{analysis.score}/100</p>
                    <p className="mt-1 text-xs text-[#777873]">
                      {recommendationLabels[analysis.recommendation] ?? analysis.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}