import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);

  const next = requestUrl.searchParams.get("next") ?? "/";

  // Güvenlik: yalnızca uygulama içindeki adreslere yönlendir.
  const safeNext =
    next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/";

  return NextResponse.redirect(
    new URL(safeNext, requestUrl.origin),
  );
}