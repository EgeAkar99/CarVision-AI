import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  const safeNext =
    next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/";

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(
        new URL(safeNext, requestUrl.origin),
      );
    }

    console.error("Supabase code exchange hatası:", error);
  }

  const errorUrl = new URL(
    "/forgot-password",
    requestUrl.origin,
  );

  errorUrl.searchParams.set(
    "error",
    "Şifre yenileme oturumu oluşturulamadı. Lütfen yeni bağlantı isteyin.",
  );

  return NextResponse.redirect(errorUrl);
}