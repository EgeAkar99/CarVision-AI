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
    {
      title: "Toplam Kullanıcı",
      value: stats.totalUsers,
      description: "Kayıtlı tüm hesaplar",
    },
    {
      title: "Toplam Analiz",
      value: stats.totalAnalyses,
      description: "Tüm zamanlarda yapılan analizler",
    },
    {
      title: "Bugünkü Analiz",
      value: stats.todayAnalyses,
      description: "Bugün tamamlanan işlemler",
    },
    {
      title: "Aktif Kullanıcı",
      value: stats.activeUsers,
      description: "Son 30 günde giriş yapanlar",
    },
  ];

  return (
    <main>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Genel Bakış
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Kullanıcıları, analizleri ve sistem istatistiklerini buradan yöneteceksin.
        </p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-sm text-slate-400">{card.title}</p>

            <p className="mt-3 text-3xl font-bold text-white">
              {card.value.toLocaleString("tr-TR")}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">
              Son Kullanıcılar
            </h2>

            <Link
              href="/admin/users"
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Tümünü Gör →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {stats.recentUsers.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="block rounded-xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-emerald-400/20"
              >
                <p className="truncate text-sm font-semibold text-white">
                  {user.email}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Kayıt: {formatDate(user.createdAt)}
                </p>
              </Link>
            ))}

            {stats.recentUsers.length === 0 && (
              <p className="text-sm text-slate-500">
                Henüz kayıtlı kullanıcı bulunmuyor.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">
              Son Analizler
            </h2>

            <Link
              href="/admin/analyses"
              className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Tümünü Gör →
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {stats.recentAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="rounded-xl border border-white/10 bg-slate-950/40 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">
                      {analysis.brand} {analysis.model}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(analysis.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-emerald-300">
                      {analysis.score}/100
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {recommendationLabels[analysis.recommendation] ??
                        analysis.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {stats.recentAnalyses.length === 0 && (
              <p className="text-sm text-slate-500">
                Henüz kayıtlı analiz bulunmuyor.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
