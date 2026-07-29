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
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/55 shadow-lg shadow-slate-950/10 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/#home"
          className="flex items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <span className="primary-glow flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 text-lg font-black text-emerald-300">
            CV
          </span>

          <div>
            <p className="text-base font-bold text-white sm:text-lg">
              CarVision <span className="text-emerald-400">AI</span>
            </p>
            <p className="hidden text-[11px] text-slate-400 sm:block">
              Akıllı araç analiz platformu
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#analyze"
            className="primary-glow rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:from-emerald-300 hover:to-emerald-400"
          >
            Araç Analiz Et
          </a>

          {user ? (
            <div className="flex items-center gap-3 border-l border-white/10 pl-5">
              <Link
                href="/analizlerim"
                className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
              >
                Analizlerim
              </Link>
              <div className="max-w-32">
                <p className="truncate text-sm font-semibold text-white">
                  {displayName}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {user.email}
                </p>
              </div>

              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-xl border border-slate-600/40 bg-slate-800/50 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
                >
                  Çıkış Yap
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-white/10 pl-5">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                Giriş Yap
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
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
          className="rounded-lg border border-slate-600/30 p-2 text-slate-200 md:hidden"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1.5 block h-0.5 w-5 bg-current" />
          <span className="mt-1.5 block h-0.5 w-5 bg-current" />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950/90 px-6 py-4 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-4">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-slate-200"
              >
                {item.label}
              </a>
            ))}

            <a
              href="#analyze"
              onClick={() => setIsOpen(false)}
              className="rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-black"
            >
              Araç Analiz Et
            </a>

            <div className="border-t border-white/10 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-white">{displayName}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>

                  <Link
                    href="/analizlerim"
                    onClick={() => setIsOpen(false)}
                    className="block w-full rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-center text-sm font-semibold text-emerald-300"
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
                    className="rounded-xl border border-slate-600/40 px-4 py-3 text-center text-sm font-semibold text-slate-200"
                  >
                    Giriş Yap
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-slate-950"
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
