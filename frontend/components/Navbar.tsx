"use client";

import { useState } from "react";

const navigationItems = [
  { label: "Ana Sayfa", href: "#home" },
  { label: "Nasıl Çalışır?", href: "#how-it-works" },
  { label: "Özellikler", href: "#features" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/55 shadow-lg shadow-slate-950/10 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <a
          href="#home"
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
        </a>

        <div className="hidden items-center gap-8 md:flex">
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
        <div className="border-t border-zinc-900 bg-slate-950/45 px-6 py-4 md:hidden">
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
          </div>
        </div>
      )}
    </nav>
  );
}
