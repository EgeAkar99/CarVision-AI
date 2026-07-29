import type { Metadata } from "next";
import AuthMessage from "@/components/auth/AuthMessage";
import AuthShell from "@/components/auth/AuthShell";
import { register } from "../actions";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "CarVision AI hesabınızı oluşturun.",
};

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { error, success } = await searchParams;
  return (
    <AuthShell
      title="Hesabınızı oluşturun"
      description="Araç analizlerinizi saklamak ve geçmiş raporlarınıza erişmek için ücretsiz hesap oluşturun."
      footerText="Zaten hesabınız var mı?"
      footerLinkText="Giriş yapın"
      footerLinkHref="/login"
    >
      <AuthMessage error={error} success={success} />

      <form action={register} className="space-y-5">
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Ad soyad
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Adınız ve soyadınız"
            className="w-full rounded-2xl border border-slate-600/40 bg-slate-950/40 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
          />
        </div>

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
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Şifre
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

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Şifreniz en az 8 karakter uzunluğunda olmalıdır.
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-semibold text-slate-200"
          >
            Şifre tekrarı
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="Şifrenizi tekrar girin"
            className="w-full rounded-2xl border border-slate-600/40 bg-slate-950/40 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-400">
          <input
            name="terms"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-950 accent-emerald-400"
          />

          <span>
            Kullanım koşullarını ve gizlilik politikasını okuduğumu, kabul
            ettiğimi onaylıyorum.
          </span>
        </label>

        <button
          type="submit"
          className="primary-glow w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-3.5 font-black text-slate-950 transition hover:-translate-y-0.5 hover:from-emerald-300 hover:to-emerald-400"
        >
          Ücretsiz Hesap Oluştur
        </button>
      </form>
    </AuthShell>
  );
}
