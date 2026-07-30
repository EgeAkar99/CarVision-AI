const cards = [
  {
    title: "Toplam Kullanıcı",
    value: "—",
    description: "Kayıtlı tüm hesaplar",
  },
  {
    title: "Toplam Analiz",
    value: "—",
    description: "Tüm zamanlarda yapılan analizler",
  },
  {
    title: "Bugünkü Analiz",
    value: "—",
    description: "Bugün tamamlanan işlemler",
  },
  {
    title: "Aktif Kullanıcı",
    value: "—",
    description: "Son dönemde giriş yapanlar",
  },
];

export default function AdminPage() {
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
              {card.value}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold">
          Son Sistem Hareketleri
        </h2>

        <p className="mt-3 text-sm text-slate-400">
          Kullanıcı ve analiz verileri bağlandığında son işlemler burada gösterilecek.
        </p>
      </section>
    </main>
  );
}