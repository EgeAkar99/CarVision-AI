"use client";

import Link from "next/link";
import { useState } from "react";
import { logout } from "@/app/(auth)/actions";

const navigationItems = [
  { label: "Ana Sayfa", href: "#home" },
  { label: "Nasıl Çalışır?", href: "#how-it-works" },
  { label: "Özellikler", href: "#features" },
];

type NavbarProps = {
  user: {
    email: string;
    fullName?: string;
  } | null;
};

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const displayName =
    user?.fullName?.trim() ||
    user?.email.split("@")[0] ||
    "Hesabım";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0a0a0a]/85 shadow-lg shadow-black/20 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/#home"
          className="flex items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c8a96a]/30 bg-gradient-to-br from-[#c8a96a]/15 to-[#b9985a]/5 text-lg font-black text-[#d6b77b] shadow-[0_10px_35px_rgba(200,169,106,0.10)]">
            CV
          </span>

          <div>
            <p className="text-base font-bold text-[#f5f5f3] sm:text-lg">
              CarVision <span className="text-[#d6b77b]">AI</span>
            </p>
            <p className="hidden text-[11px] text-[#8f918d] sm:block">
              Akıllı araç analiz platformu
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#c8c8c4] transition hover:text-[#f5f5f3]"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#analyze"
            className="rounded-xl border border-[#c8a96a]/35 bg-gradient-to-r from-[#c8a96a] to-[#b9985a] px-5 py-2.5 text-sm font-bold text-[#11100d] shadow-[0_12px_40px_rgba(200,169,106,0.14)] transition hover:-translate-y-0.5 hover:from-[#d6b77b] hover:to-[#c8a96a]"
          >
            Araç Analiz Et
          </a>

          {user ? (
            <div className="flex items-center gap-3 border-l border-white/[0.08] pl-5">
              <Link
                href="/analizlerim"
                className="rounded-xl border border-[#c8a96a]/25 bg-[#c8a96a]/[0.07] px-4 py-2.5 text-sm font-semibold text-[#d6b77b] transition hover:border-[#c8a96a]/40 hover:bg-[#c8a96a]/[0.11]"
              >
                Analizlerim
              </Link>

              <div className="max-w-32">
                <p className="truncate text-sm font-semibold text-[#f5f5f3]">
                  {displayName}
                </p>
                <p className="truncate text-xs text-[#8f918d]">
                  {user.email}
                </p>
              </div>

              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-xl border border-white/[0.10] bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-[#d5d5d1] transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
                >
                  Çıkış Yap
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-white/[0.08] pl-5">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#d5d5d1] transition hover:bg-white/[0.04] hover:text-white"
              >
                Giriş Yap
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-[#c8a96a]/25 bg-[#c8a96a]/[0.07] px-4 py-2.5 text-sm font-semibold text-[#d6b77b] transition hover:border-[#c8a96a]/40 hover:bg-[#c8a96a]/[0.11]"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Menüyü aç"
          aria-expanded={isOpen}
          className="rounded-lg border border-white/[0.10] p-2 text-[#d5d5d1] md:hidden"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1.5 block h-0.5 w-5 bg-current" />
          <span className="mt-1.5 block h-0.5 w-5 bg-current" />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/[0.08] bg-[#080808]/95 px-6 py-4 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-4">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-[#d5d5d1]"
              >
                {item.label}
              </a>
            ))}

            <a
              href="#analyze"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-[#c8a96a]/35 bg-gradient-to-r from-[#c8a96a] to-[#b9985a] px-4 py-3 text-center text-sm font-bold text-[#11100d]"
            >
              Araç Analiz Et
            </a>

            <div className="border-t border-white/[0.08] pt-4">
              {user ? (
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-[#f5f5f3]">{displayName}</p>
                    <p className="text-xs text-[#8f918d]">{user.email}</p>
                  </div>

                  <Link
                    href="/analizlerim"
                    onClick={() => setIsOpen(false)}
                    className="block w-full rounded-xl border border-[#c8a96a]/25 bg-[#c8a96a]/[0.07] px-4 py-3 text-center text-sm font-semibold text-[#d6b77b]"
                  >
                    Analizlerim
                  </Link>

                  <form action={logout}>
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200"
                    >
                      Çıkış Yap
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-white/[0.10] px-4 py-3 text-center text-sm font-semibold text-[#d5d5d1]"
                  >
                    Giriş Yap
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-[#c8a96a]/35 bg-gradient-to-r from-[#c8a96a] to-[#b9985a] px-4 py-3 text-center text-sm font-bold text-[#11100d]"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}