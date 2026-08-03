"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function redirectWithMessage(
  path: string,
  type: "error" | "success",
  message: string,
): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`${path}?${params.toString()}`);
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirectWithMessage(
      "/login",
      "error",
      "E-posta adresinizi ve şifrenizi girin.",
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithMessage(
      "/login",
      "error",
      "E-posta adresi veya şifre hatalı.",
    );
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function register(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const termsAccepted = formData.get("terms") === "on";

  if (fullName.length < 2) {
    redirectWithMessage(
      "/register",
      "error",
      "Lütfen geçerli bir ad ve soyad girin.",
    );
  }

  if (!email) {
    redirectWithMessage(
      "/register",
      "error",
      "Lütfen geçerli bir e-posta adresi girin.",
    );
  }

  if (password.length < 8) {
    redirectWithMessage(
      "/register",
      "error",
      "Şifreniz en az 8 karakter olmalıdır.",
    );
  }

  if (password !== confirmPassword) {
    redirectWithMessage(
      "/register",
      "error",
      "Girdiğiniz şifreler birbiriyle eşleşmiyor.",
    );
  }

  if (!termsAccepted) {
    redirectWithMessage(
      "/register",
      "error",
      "Devam etmek için kullanım koşullarını kabul etmelisiniz.",
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      }/login?success=${encodeURIComponent(
        "E-posta adresiniz doğrulandı. Artık giriş yapabilirsiniz.",
      )}`,
    },
  });

  if (error) {
     console.error("Supabase kayıt hatası:", error);

     redirectWithMessage(
     "/register",
     "error",
     `Hata: ${error.message}`,
    );
  }

  redirectWithMessage(
    "/login",
    "success",
    "Hesabınız oluşturuldu. E-posta adresinize gönderilen doğrulama bağlantısını açtıktan sonra giriş yapabilirsiniz.",
  );
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    redirectWithMessage(
      "/forgot-password",
      "error",
      "Lütfen e-posta adresinizi girin.",
    );
  }

  const supabase = await createClient();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/confirm?next=/update-password`,
  });

  if (error) {
    redirectWithMessage(
      "/forgot-password",
      "error",
      "Şifre sıfırlama bağlantısı gönderilemedi. Daha sonra tekrar deneyin.",
    );
  }

  redirectWithMessage(
    "/forgot-password",
    "success",
    "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
  );
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < 8) {
    redirectWithMessage(
      "/update-password",
      "error",
      "Şifreniz en az 8 karakter olmalıdır.",
    );
  }

  if (password !== confirmPassword) {
    redirectWithMessage(
      "/update-password",
      "error",
      "Girdiğiniz şifreler birbiriyle eşleşmiyor.",
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirectWithMessage(
      "/forgot-password",
      "error",
      "Şifre yenileme oturumu bulunamadı. Lütfen yeni bağlantı isteyin.",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirectWithMessage(
      "/update-password",
      "error",
      "Şifreniz güncellenemedi. Lütfen tekrar deneyin.",
    );
  }

  revalidatePath("/", "layout");

  redirectWithMessage(
    "/login",
    "success",
    "Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.",
  );
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
