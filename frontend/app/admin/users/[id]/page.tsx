import { notFound } from "next/navigation";

import AdminUserActions from "@/components/admin/AdminUserActions";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

type UserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function UserDetailPage({
  params,
}: UserDetailPageProps) {
  await requireAdmin();

  const { id } = await params;
  const supabaseAdmin = createAdminClient();

  const { data, error } =
    await supabaseAdmin.auth.admin.getUserById(id);

  if (error || !data.user) {
    notFound();
  }

  const user = data.user;
  const isBanned = Boolean(user.banned_until);
  const isAdminAccount = user.id === process.env.ADMIN_USER_ID;

  return (
    <main>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Kullanıcı Detayı
        </p>

        <h1 className="mt-2 break-all text-3xl font-bold">
          {user.email ?? "E-posta bulunamadı"}
        </h1>

        <p className="mt-2 text-slate-400">
          Kullanıcının hesap bilgilerini ve yönetim işlemlerini görüntüle.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold">Hesap Bilgileri</h2>

          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="text-slate-500">Kullanıcı ID</dt>
              <dd className="mt-1 break-all font-mono text-slate-200">
                {user.id}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">E-posta</dt>
              <dd className="mt-1 break-all text-slate-200">
                {user.email ?? "—"}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">Kayıt tarihi</dt>
              <dd className="mt-1 text-slate-200">
                {formatDate(user.created_at)}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">Son giriş</dt>
              <dd className="mt-1 text-slate-200">
                {formatDate(user.last_sign_in_at)}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">E-posta doğrulama</dt>
              <dd className="mt-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    user.email_confirmed_at
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {user.email_confirmed_at
                    ? "Doğrulandı"
                    : "Doğrulanmadı"}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">Hesap durumu</dt>
              <dd className="mt-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isBanned
                      ? "bg-red-400/10 text-red-300"
                      : "bg-sky-400/10 text-sky-300"
                  }`}
                >
                  {isBanned ? "Askıya Alındı" : "Aktif"}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">Hesap türü</dt>
              <dd className="mt-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isAdminAccount
                      ? "bg-violet-400/10 text-violet-300"
                      : "bg-slate-400/10 text-slate-300"
                  }`}
                >
                  {isAdminAccount ? "Ana Yönetici" : "Standart Kullanıcı"}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold">Yönetim İşlemleri</h2>

          <p className="mt-2 text-sm text-slate-400">
            Kullanıcının e-posta adresini, şifresini ve hesap durumunu yönet.
          </p>

          <div className="mt-6">
            <AdminUserActions
              userId={user.id}
              currentEmail={user.email ?? ""}
              isBanned={isBanned}
              isAdminAccount={isAdminAccount}
            />
          </div>
        </section>
      </div>
    </main>
  );
}