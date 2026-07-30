"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AdminUserActionsProps = {
  userId: string;
  currentEmail: string;
  isBanned: boolean;
  isAdminAccount: boolean;
};

type ApiResponse = {
  success: boolean;
  message: string;
};

export default function AdminUserActions({
  userId,
  currentEmail,
  isBanned,
  isAdminAccount,
}: AdminUserActionsProps) {
  const router = useRouter();

  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function sendRequest(
    action: string,
    body?: Record<string, string>,
  ) {
    setLoadingAction(action);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          ...body,
        }),
      });

      const result = (await response.json()) as ApiResponse;

      setMessage(result.message);
      setIsError(!response.ok || !result.success);

      if (response.ok && result.success) {
        setPassword("");
        router.refresh();
      }
    } catch {
      setMessage("İşlem sırasında bağlantı hatası oluştu.");
      setIsError(true);
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await sendRequest("update-email", {
      email,
    });
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await sendRequest("update-password", {
      password,
    });
  }

  async function handleSuspendToggle() {
    const action = isBanned ? "unsuspend" : "suspend";

    const confirmed = window.confirm(
      isBanned
        ? "Bu kullanıcı hesabını tekrar etkinleştirmek istiyor musunuz?"
        : "Bu kullanıcı hesabını askıya almak istiyor musunuz?",
    );

    if (!confirmed) {
      return;
    }

    await sendRequest(action);
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Bu kullanıcı kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam edilsin mi?",
    );

    if (!confirmed) {
      return;
    }

    setLoadingAction("delete");
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        setMessage(result.message);
        setIsError(true);
        return;
      }

      router.push("/admin/users");
      router.refresh();
    } catch {
      setMessage("Kullanıcı silinirken bağlantı hatası oluştu.");
      setIsError(true);
    } finally {
      setLoadingAction(null);
    }
  }

  if (isAdminAccount) {
    return (
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
        <p className="font-medium text-emerald-300">Ana yönetici hesabı</p>

        <p className="mt-1 text-sm text-slate-400">
          Güvenlik nedeniyle bu hesap askıya alınamaz, düzenlenemez veya
          silinemez.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            isError
              ? "border-red-400/20 bg-red-400/10 text-red-300"
              : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleEmailSubmit} className="space-y-3">
        <label
          htmlFor="admin-user-email"
          className="block text-sm font-medium text-slate-300"
        >
          E-posta adresi
        </label>

        <input
          id="admin-user-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-emerald-400/60"
        />

        <button
          type="submit"
          disabled={loadingAction !== null || email === currentEmail}
          className="w-full rounded-xl bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "update-email"
            ? "E-posta değiştiriliyor..."
            : "E-posta adresini değiştir"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-3">
        <label
          htmlFor="admin-user-password"
          className="block text-sm font-medium text-slate-300"
        >
          Yeni şifre
        </label>

        <input
          id="admin-user-password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="En az 8 karakter"
          autoComplete="new-password"
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-amber-400/60"
        />

        <button
          type="submit"
          disabled={loadingAction !== null || password.length < 8}
          className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "update-password"
            ? "Şifre değiştiriliyor..."
            : "Yeni şifre belirle"}
        </button>
      </form>

      <div className="border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={handleSuspendToggle}
          disabled={loadingAction !== null}
          className="w-full rounded-xl bg-orange-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "suspend" || loadingAction === "unsuspend"
            ? "İşlem uygulanıyor..."
            : isBanned
              ? "Hesabı tekrar etkinleştir"
              : "Hesabı askıya al"}
        </button>
      </div>

      <div className="border-t border-red-400/20 pt-6">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loadingAction !== null}
          className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "delete"
            ? "Kullanıcı siliniyor..."
            : "Kullanıcıyı kalıcı olarak sil"}
        </button>
      </div>
    </div>
  );
}