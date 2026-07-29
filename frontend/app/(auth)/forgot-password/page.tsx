import type { Metadata } from "next";
import Link from "next/link";
import AuthMessage from "@/components/auth/AuthMessage";
import AuthShell from "@/components/auth/AuthShell";
import { requestPasswordReset } from "../actions";

export const metadata: Metadata = {
  title: "Şifremi Unuttum",
  description: "CarVision AI hesabınız için şifre sıfırlama bağlantısı alın.",
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { error, success } = await searchParams;
  return (
    <AuthShell
      title="Şifrenizi sıfırlayın"
      description="Hesabınıza bağlı e-posta adresini yazın. Size güvenli bir şifre sıfırlama bağlantısı gönderelim."
      footerText="Şifrenizi hatırladınız mı?"
      footerLinkText="Giriş yapın"
      footerLinkHref="/login"
    >
      <AuthMessage error={error} success={success} />

      <form action={requestPasswordReset} className="space-y-5">
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

        <button
          type="submit"
          className="primary-glow w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-3.5 font-black text-slate-950 transition hover:-translate-y-0.5 hover:from-emerald-300 hover:to-emerald-400"
        >
          Sıfırlama Bağlantısı Gönder
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-sky-400/15 bg-sky-400/5 px-4 py-3">
        <p className="text-sm leading-6 text-slate-400">
          E-posta birkaç dakika içinde gelmezse spam veya gereksiz klasörünüzü
          kontrol edin.
        </p>
      </div>

      <Link
        href="/"
        className="mt-6 block text-center text-sm font-semibold text-slate-500 transition hover:text-slate-300"
      >
        ← Ana sayfaya dön
      </Link>
    </AuthShell>
  );
}
