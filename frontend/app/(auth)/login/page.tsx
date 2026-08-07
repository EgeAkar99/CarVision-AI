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
            className="mb-2 block text-sm font-semibold text-[#d5d5d1]"
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
            className="w-full rounded-2xl border border-white/[0.10] bg-[#0d0e10] px-4 py-3.5 text-[#f5f5f3] outline-none transition placeholder:text-[#62635f] focus:border-[#c8a96a]/60 focus:ring-4 focus:ring-[#c8a96a]/10"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#d5d5d1]"
            >
              Şifre
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-[#d6b77b] transition hover:text-[#e2c88f]"
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
            className="w-full rounded-2xl border border-white/[0.10] bg-[#0d0e10] px-4 py-3.5 text-[#f5f5f3] outline-none transition placeholder:text-[#62635f] focus:border-[#c8a96a]/60 focus:ring-4 focus:ring-[#c8a96a]/10"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl border border-[#c8a96a]/35 bg-gradient-to-r from-[#c8a96a] to-[#b9985a] px-5 py-3.5 font-bold text-[#11100d] shadow-[0_14px_45px_rgba(200,169,106,0.14)] transition hover:-translate-y-0.5 hover:from-[#d6b77b] hover:to-[#c8a96a]"
        >
          Giriş Yap
        </button>
      </form>
    </AuthShell>
  );
}