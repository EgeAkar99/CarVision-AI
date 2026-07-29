import type { Metadata } from "next";
import Link from "next/link";
import AuthMessage from "@/components/auth/AuthMessage";
import AuthShell from "@/components/auth/AuthShell";
import { login } from "../actions";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "CarVision AI hesabınıza giriş yapın.",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { error, success } = await searchParams;
  return (
    <AuthShell
      title="Tekrar hoş geldiniz"
      description="Kayıtlı analizlerinize ulaşmak için hesabınıza giriş yapın."
      footerText="Henüz hesabınız yok mu?"
      footerLinkText="Kayıt olun"
      footerLinkHref="/register"
    >
      <AuthMessage error={error} success={success} />

      <form action={login} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            E-posta adresi
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="ornek@email.com"
            className="w-full rounded-2xl border border-slate-600/40 bg-slate-950/40 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-200"
            >
              Şifre
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              Şifremi unuttum
            </Link>
          </div>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Şifrenizi girin"
            className="w-full rounded-2xl border border-slate-600/40 bg-slate-950/40 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
          />
        </div>

        <button
          type="submit"
          className="primary-glow w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-3.5 font-black text-slate-950 transition hover:-translate-y-0.5 hover:from-emerald-300 hover:to-emerald-400"
        >
          Giriş Yap
        </button>
      </form>
    </AuthShell>
  );
}
