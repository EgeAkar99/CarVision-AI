import Link from "next/link";

import { requireAdmin } from "@/lib/admin/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

type AdminAnalysis = {
  id: string;
  user_id: string;
  source: "manual" | "browser-extension";
  listing_url: string | null;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_mileage: number;
  vehicle_price: number;
  vehicle_city: string;
  score: number;
  analysis_confidence: number;
  purchase_recommendation: string;
  created_at: string;
};

type SearchParams = Promise<{
  q?: string;
  source?: string;
}>;

const recommendationLabels: Record<string, string> = {
  strong_buy: "Güçlü Alım",
  buy: "Satın Alınabilir",
  consider: "Değerlendir",
  avoid: "Uzak Dur",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

function cleanSearchValue(value: string) {
  return value.replace(/[%_,()]/g, " ").trim().slice(0, 100);
}

export default async function AdminAnalysesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();

  const params = await searchParams;

  const query = cleanSearchValue(params.q ?? "");
  const source =
    params.source === "manual" ||
    params.source === "browser-extension"
      ? params.source
      : "";

  const supabase = createAdminClient();

  let analysesQuery = supabase
    .from("vehicle_analyses")
    .select(
      `
        id,
        user_id,
        source,
        listing_url,
        vehicle_brand,
        vehicle_model,
        vehicle_year,
        vehicle_mileage,
        vehicle_price,
        vehicle_city,
        score,
        analysis_confidence,
        purchase_recommendation,
        created_at
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (query) {
    analysesQuery = analysesQuery.or(
      `vehicle_brand.ilike.%${query}%,vehicle_model.ilike.%${query}%,vehicle_city.ilike.%${query}%`,
    );
  }

  if (source) {
    analysesQuery = analysesQuery.eq("source", source);
  }

  const { data, error, count } = await analysesQuery.limit(100);

  if (error) {
    throw new Error(`Analizler alınamadı: ${error.message}`);
  }

  const analyses = (data ?? []) as AdminAnalysis[];
  const hasFilters = Boolean(query || source);

  return (
    <main>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a96a]">
            Analiz Yönetimi
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#f5f5f3]">
            Tüm Analizler
          </h1>

          <p className="mt-2 text-[#8f918d]">
            Sistemde kayıtlı araç analizlerini görüntüle ve incele.
          </p>
        </div>

        <Link
          href="/admin"
          className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-sm font-semibold text-[#c7c7c3] transition hover:border-[#c8a96a]/30 hover:text-[#e2c88f]"
        >
          ← Dashboard
        </Link>
      </div>

      <form
        method="GET"
        className="mt-8 grid gap-3 rounded-[20px] border border-white/[0.08] bg-[#101113] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.2)] md:grid-cols-[minmax(0,1fr)_220px_auto]"
      >
        <label className="block">
          <span className="sr-only">Marka, model veya şehir ara</span>

          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Marka, model veya şehir ara..."
            className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0b0c0e] px-4 text-sm text-[#f5f5f3] outline-none transition placeholder:text-[#5f605c] focus:border-[#c8a96a]/40 focus:ring-1 focus:ring-[#c8a96a]/10"
          />
        </label>

        <label className="block">
          <span className="sr-only">Analiz kaynağı</span>

          <select
            name="source"
            defaultValue={source}
            className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0b0c0e] px-4 text-sm text-[#f5f5f3] outline-none transition focus:border-[#c8a96a]/40"
          >
            <option value="">Tüm kaynaklar</option>
            <option value="manual">Manuel</option>
            <option value="browser-extension">Tarayıcı uzantısı</option>
          </select>
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="h-11 flex-1 rounded-xl border border-[#c8a96a]/35 bg-gradient-to-r from-[#c8a96a] to-[#b9985a] px-5 text-sm font-bold text-[#11100d] transition hover:from-[#d6b77b] hover:to-[#c8a96a]"
          >
            Filtrele
          </button>

          {hasFilters && (
            <Link
              href="/admin/analyses"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/[0.08] px-4 text-sm font-semibold text-[#c7c7c3] transition hover:border-red-400/30 hover:text-red-300"
            >
              Temizle
            </Link>
          )}
        </div>
      </form>

      <section className="mt-4 overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#101113] shadow-[0_24px_75px_rgba(0,0,0,0.24)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
          <p className="text-sm text-[#8f918d]">
            {hasFilters ? "Filtrelenen" : "Toplam"}{" "}
            <span className="font-semibold text-[#d6b77b]">
              {count ?? analyses.length}
            </span>{" "}
            analiz
          </p>

          {hasFilters && (
            <p className="text-xs text-[#d6b77b]">
              Aktif filtre uygulanıyor
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.025] text-[11px] uppercase tracking-[0.12em] text-[#6f706c]">
              <tr>
                <th className="px-5 py-4">Araç</th>
                <th className="px-5 py-4">Yıl</th>
                <th className="px-5 py-4">Kilometre</th>
                <th className="px-5 py-4">Fiyat</th>
                <th className="px-5 py-4">Şehir</th>
                <th className="px-5 py-4">Puan</th>
                <th className="px-5 py-4">Güven</th>
                <th className="px-5 py-4">Öneri</th>
                <th className="px-5 py-4">Kaynak</th>
                <th className="px-5 py-4">Tarih</th>
                <th className="px-5 py-4">İşlem</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.07]">
              {analyses.map((analysis) => (
                <tr
                  key={analysis.id}
                  className="transition hover:bg-white/[0.018]"
                >
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#f5f5f3]">
                    {analysis.vehicle_brand} {analysis.vehicle_model}
                  </td>

                  <td className="px-5 py-4 text-[#b6b6b2]">
                    {analysis.vehicle_year}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-[#b6b6b2]">
                    {formatNumber(analysis.vehicle_mileage)} km
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-[#b6b6b2]">
                    {formatCurrency(analysis.vehicle_price)}
                  </td>

                  <td className="px-5 py-4 text-[#b6b6b2]">
                    {analysis.vehicle_city}
                  </td>

                  <td className="px-5 py-4 font-bold text-[#d6b77b]">
                    {analysis.score}/100
                  </td>

                  <td className="px-5 py-4 text-[#b6b6b2]">
                    %{analysis.analysis_confidence}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-[#b6b6b2]">
                    {recommendationLabels[
                      analysis.purchase_recommendation
                    ] ?? analysis.purchase_recommendation}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-[#777873]">
                    {analysis.source === "browser-extension"
                      ? "Uzantı"
                      : "Manuel"}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-[#777873]">
                    {formatDate(analysis.created_at)}
                  </td>

                  <td className="px-5 py-4">
                    {analysis.listing_url ? (
                      <a
                        href={analysis.listing_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-[#d6b77b] transition hover:text-[#e2c88f]"
                      >
                        İlanı Aç
                      </a>
                    ) : (
                      <span className="text-xs text-[#555651]">
                        İlan yok
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {analyses.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-5 py-12 text-center text-[#666762]"
                  >
                    {hasFilters
                      ? "Filtrelere uygun analiz bulunamadı."
                      : "Henüz kayıtlı analiz bulunmuyor."}
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