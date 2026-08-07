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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a96a]">
          Kullanıcı Yönetimi
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#f5f5f3]">
          Kullanıcılar
        </h1>

        <p className="mt-2 text-[#8f918d]">
          Sistemde kayıtlı tüm kullanıcı hesaplarını görüntüle.
        </p>
      </div>

      <section className="mt-8 overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#101113] shadow-[0_24px_75px_rgba(0,0,0,0.24)]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <p className="text-sm text-[#8f918d]">
            Toplam{" "}
            <span className="font-semibold text-[#d6b77b]">
              {users.length}
            </span>{" "}
            kullanıcı
          </p>

          <span className="text-[11px] uppercase tracking-[0.18em] text-[#5f605c]">
            Hesap Yönetimi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.025] text-[11px] uppercase tracking-[0.12em] text-[#6f706c]">
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

            <tbody className="divide-y divide-white/[0.07]">
              {users.map((user) => {
                const isBanned = Boolean(user.banned_until);

                return (
                  <tr
                    key={user.id}
                    className="transition duration-200 hover:bg-white/[0.018]"
                  >
                    <td className="px-5 py-4 font-medium text-[#f5f5f3]">
                      {user.email ?? "E-posta yok"}
                    </td>

                    <td className="max-w-[220px] truncate px-5 py-4 font-mono text-xs text-[#777873]">
                      {user.id}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-[#b6b6b2]">
                      {formatDate(user.created_at)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-[#b6b6b2]">
                      {formatDate(user.last_sign_in_at)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          user.email_confirmed_at
                            ? "border-[#c8a96a]/25 bg-[#c8a96a]/[0.06] text-[#d6b77b]"
                            : "border-amber-400/25 bg-amber-400/[0.07] text-amber-200"
                        }`}
                      >
                        {user.email_confirmed_at
                          ? "Doğrulandı"
                          : "Doğrulanmadı"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          isBanned
                            ? "border-red-400/25 bg-red-400/[0.07] text-red-200"
                            : "border-white/[0.10] bg-white/[0.035] text-[#cfcfcb]"
                        }`}
                      >
                        {isBanned ? "Askıya Alındı" : "Aktif"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="inline-flex rounded-lg border border-[#c8a96a]/30 bg-[#c8a96a]/[0.07] px-3 py-2 text-xs font-semibold text-[#d6b77b] transition hover:border-[#c8a96a]/45 hover:bg-[#c8a96a]/[0.12] hover:text-[#e2c88f]"
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
                    className="px-5 py-12 text-center text-[#666762]"
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