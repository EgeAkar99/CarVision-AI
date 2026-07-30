import Link from "next/link";

import { createAdminClient } from "@/lib/supabase/admin";

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminUsersPage() {
  const supabaseAdmin = createAdminClient();

  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 100,
  });

  if (error) {
    throw new Error(`Kullanıcılar alınamadı: ${error.message}`);
  }

  return (
    <main>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Kullanıcı Yönetimi
        </p>

        <h1 className="mt-2 text-3xl font-bold">Kullanıcılar</h1>

        <p className="mt-2 text-slate-400">
          Sistemde kayıtlı tüm kullanıcı hesaplarını görüntüle.
        </p>
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-sm text-slate-400">
            Toplam {users.length} kullanıcı
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">E-posta</th>
                <th className="px-5 py-4">Kullanıcı ID</th>
                <th className="px-5 py-4">Kayıt Tarihi</th>
                <th className="px-5 py-4">Son Giriş</th>
                <th className="px-5 py-4">E-posta Durumu</th>
                <th className="px-5 py-4">Hesap Durumu</th>
                <th className="px-5 py-4">İşlem</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {users.map((user) => {
                const isBanned = Boolean(user.banned_until);

                return (
                  <tr key={user.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      {user.email ?? "E-posta yok"}
                    </td>

                    <td className="max-w-[220px] truncate px-5 py-4 font-mono text-xs text-slate-400">
                      {user.id}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                      {formatDate(user.created_at)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                      {formatDate(user.last_sign_in_at)}
                    </td>

                    <td className="px-5 py-4">
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
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          isBanned
                            ? "bg-red-400/10 text-red-300"
                            : "bg-sky-400/10 text-sky-300"
                        }`}
                      >
                        {isBanned ? "Askıya Alındı" : "Aktif"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="inline-flex rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    Henüz kayıtlı kullanıcı bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}