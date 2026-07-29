import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
};

export default function AuthShell({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="hero-glow" />

      <Link
        href="/"
        className="absolute left-4 top-4 z-20 flex items-center gap-3 sm:left-8 sm:top-8"
      >
        <span className="primary-glow flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 text-lg font-black text-emerald-300">
          CV
        </span>

        <div>
          <p className="font-bold text-white">
            CarVision <span className="text-emerald-400">AI</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Akıllı araç analiz platformu
          </p>
        </div>
      </Link>

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/30 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden min-h-[680px] flex-col justify-between border-r border-white/10 bg-gradient-to-br from-emerald-400/10 via-slate-900/30 to-sky-400/10 p-12 lg:flex">
          <div>
            <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              CarVision AI Hesabı
            </span>

            <h2 className="hero-title-shadow mt-8 max-w-lg text-4xl font-black leading-tight text-white">
              Araç analizlerinizi güvenle saklayın ve dilediğiniz zaman yeniden
              inceleyin.
            </h2>

            <p className="mt-6 max-w-lg leading-7 text-slate-300">
              Hesabınızla analiz geçmişinize erişebilir, önceki araçları
              karşılaştırabilir ve satın alma sürecinizi daha düzenli şekilde
              yönetebilirsiniz.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              "Geçmiş analizlere hızlı erişim",
              "Araç raporlarını tek yerde saklama",
              "Güvenli e-posta doğrulaması",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/15 font-bold text-emerald-300">
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-[680px] items-center px-6 py-14 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                CarVision AI
              </p>

              <h1 className="text-3xl font-black text-white sm:text-4xl">
                {title}
              </h1>

              <p className="mt-3 leading-6 text-slate-400">{description}</p>
            </div>

            {children}

            <p className="mt-8 text-center text-sm text-slate-400">
              {footerText}{" "}
              <Link
                href={footerLinkHref}
                className="font-bold text-emerald-400 transition hover:text-emerald-300"
              >
                {footerLinkText}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
