import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navbarUser = user
    ? {
        email: user.email ?? "",
        fullName:
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : undefined,
      }
    : null;

  return (
    <main className="min-h-screen bg-slate-950/45 text-white">
      <Navbar user={navbarUser} />
      <Hero />

      <footer className="border-t border-white/5 bg-slate-900/45">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CarVision AI. Tüm hakları saklıdır.</p>

          <p>Daha bilinçli araç kararları için geliştirildi.</p>
        </div>
      </footer>
    </main>
  );
}
