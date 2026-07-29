import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_45%)]" />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-500/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-10 w-10 text-blue-400"
            aria-hidden="true"
          >
            <path
              d="M4.93 4.93a10 10 0 0 1 14.14 0M7.76 7.76a6 6 0 0 1 8.48 0M10.59 10.59a2 2 0 0 1 2.82 0M3 3l18 18M12 18h.01"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
          CarVision AI
        </p>

        <h1 className="text-3xl font-bold tracking-tight">
          İnternet bağlantısı yok
        </h1>

        <p className="mt-4 leading-7 text-slate-300">
          Araç analizi yapabilmek için internet bağlantısı gerekiyor. Bağlantın
          geri geldiğinde tekrar deneyebilirsin.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 font-semibold transition hover:bg-blue-500"
        >
          Tekrar dene
        </Link>
      </section>
    </main>
  );
}
