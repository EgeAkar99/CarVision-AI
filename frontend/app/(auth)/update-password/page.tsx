import type { Metadata } from "next";
import AuthMessage from "@/components/auth/AuthMessage";
import AuthShell from "@/components/auth/AuthShell";
import { updatePassword } from "../actions";

export const metadata: Metadata = {
  title: "Yeni Şifre Belirle",
  description: "CarVision AI hesabınız için yeni bir şifre belirleyin.",
};

type UpdatePasswordPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function UpdatePasswordPage({
  searchParams,
}: UpdatePasswordPageProps) {
  const { error, success } = await searchParams;

  return (
    <AuthShell
      title="Yeni şifrenizi belirleyin"
      description="Hesabınız için en az 8 karakterden oluşan güvenli bir şifre oluşturun."
      footerText="Şifrenizi hatırladınız mı?"
      footerLinkText="Giriş yapın"
      footerLinkHref="/login"
    >
      <AuthMessage error={error} success={success} />

      <form action={updatePassword} className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Yeni şifre
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="En az 8 karakter"
            className="w-full rounded-2xl border border-slate-600/40 bg-slate-950/40 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Yeni şifre tekrarı
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Yeni şifrenizi tekrar girin"
            className="w-full rounded-2xl border border-slate-600/40 bg-slate-950/40 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
          />
        </div>

        <button
          type="submit"
          className="primary-glow w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-3.5 font-black text-slate-950 transition hover:-translate-y-0.5 hover:from-emerald-300 hover:to-emerald-400"
        >
          Şifreyi Güncelle
        </button>
      </form>
    </AuthShell>
  );
}
