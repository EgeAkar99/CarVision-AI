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
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#home"
          className="flex items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-lg font-black text-emerald-400">
            CV
          </span>

          <div>
            <p className="text-lg font-bold text-white">
              CarVision <span className="text-emerald-400">AI</span>
            </p>
            <p className="text-[11px] text-zinc-500">
              Akıllı araç analiz platformu
            </p>
          </div>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}

          <a
            href="#analyze"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400"
          >
            Araç Analiz Et
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Menüyü aç"
          aria-expanded={isOpen}
          className="rounded-lg border border-zinc-800 p-2 text-zinc-300 md:hidden"
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1.5 block h-0.5 w-5 bg-current" />
          <span className="mt-1.5 block h-0.5 w-5 bg-current" />
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-zinc-900 bg-black px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-zinc-300"
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
