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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070707] px-4 py-10 text-[#f5f5f3] sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[8%] h-72 w-72 rounded-full bg-[#c8a96a]/[0.055] blur-[120px]" />
        <div className="absolute bottom-[4%] right-[8%] h-80 w-80 rounded-full bg-white/[0.02] blur-[130px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8a96a]/30 to-transparent" />
      </div>

      <Link
        href="/"
        className="absolute left-4 top-4 z-20 flex items-center gap-3 sm:left-8 sm:top-8"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c8a96a]/30 bg-[#c8a96a]/[0.06] text-lg font-black text-[#d6b77b] shadow-[0_10px_35px_rgba(200,169,106,0.10)]">
          CV
        </span>

        <div>
          <p className="font-bold text-[#f5f5f3]">
            CarVision <span className="text-[#d6b77b]">AI</span>
          </p>
          <p className="text-[11px] text-[#8f918d]">
            Akıllı araç analiz platformu
          </p>
        </div>
      </Link>

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0d0e10]/95 shadow-[0_35px_100px_rgba(0,0,0,0.48)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden border-r border-white/[0.07] bg-[#0a0a0b] p-12 lg:flex">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 bottom-12 h-72 w-72 rounded-full bg-[#c8a96a]/[0.045] blur-[100px]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c8a96a]/20 to-transparent" />
          </div>

          <div className="relative z-10">
            <span className="inline-flex rounded-full border border-[#c8a96a]/25 bg-[#c8a96a]/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#d6b77b]">
              CarVision AI Hesabı
            </span>

            <h2 className="mt-8 max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-[#f5f5f3]">
              Araç analizlerinizi{" "}
              <span className="text-[#d6b77b]">güvenle</span> saklayın ve
              dilediğiniz zaman yeniden{" "}
              <span className="text-[#d6b77b]">inceleyin.</span>
            </h2>

            <p className="mt-6 max-w-lg leading-7 text-[#9a9b97]">
              Hesabınızla analiz geçmişinize erişebilir, önceki araçları
              karşılaştırabilir ve satın alma sürecinizi daha düzenli şekilde
              yönetebilirsiniz.
            </p>
          </div>

          <div className="relative z-10 grid gap-3">
            {[
              "Geçmiş analizlere hızlı erişim",
              "Araç raporlarını tek yerde saklama",
              "Güvenli e-posta doğrulaması",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-sm text-[#d0d0cc]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c8a96a]/25 bg-[#c8a96a]/[0.06] text-sm font-bold text-[#d6b77b]">
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-[680px] items-center bg-[#101113] px-6 py-14 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#c8a96a]">
                CarVision AI
              </p>

              <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#f5f5f3] sm:text-4xl">
                {title}
              </h1>

              <p className="mt-3 leading-6 text-[#8f918d]">
                {description}
              </p>
            </div>

            {children}

            <p className="mt-8 text-center text-sm text-[#8f918d]">
              {footerText}{" "}
              <Link
                href={footerLinkHref}
                className="font-semibold text-[#d6b77b] transition hover:text-[#e2c88f]"
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