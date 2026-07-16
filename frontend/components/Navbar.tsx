export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6">
      <div className="text-2xl font-bold text-emerald-400">
        CarVision AI
      </div>

      <div className="flex gap-8 text-zinc-300">
        <a className="hover:text-white transition">
          Ana Sayfa
        </a>

        <a className="hover:text-white transition">
          Nasıl Çalışır?
        </a>

        <a className="hover:text-white transition">
          Hakkımızda
        </a>
      </div>
    </nav>
  );
}