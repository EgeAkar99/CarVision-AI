import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />

      <footer className="border-t border-white/5 bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CarVision AI. Tüm hakları saklıdır.</p>

          <p>
            Daha bilinçli araç kararları için geliştirildi.
          </p>
        </div>
      </footer>
    </main>
  );
}
