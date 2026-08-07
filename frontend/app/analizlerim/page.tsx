import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  AnalysisResult,
  PurchaseRecommendation,
} from "@/types/analysis";

export const metadata: Metadata = {
  title: "Analizlerim",
  description: "CarVision AI araç analiz geçmişinizi görüntüleyin.",
};

type SavedAnalysis = {
  id: string;
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
  purchase_recommendation: PurchaseRecommendation;
  result: AnalysisResult;
  created_at: string;
};

const recommendationLabels: Record<
  PurchaseRecommendation,
  string
> = {
  strong_buy: "Çok Güçlü Aday",
  buy: "Güçlü Aday",
  consider: "İncelenmeye Değer",
  avoid: "Yüksek Riskli",
};

const recommendationClasses: Record<
  PurchaseRecommendation,
  string
> = {
  strong_buy:
    "border-[#c8a96a]/35 bg-[#c8a96a]/[0.08] text-[#e2c88f]",
  buy:
    "border-[#c8a96a]/30 bg-[#c8a96a]/[0.06] text-[#d6b77b]",
  consider:
    "border-amber-400/25 bg-amber-400/[0.07] text-amber-200",
  avoid:
    "border-red-400/25 bg-red-400/[0.07] text-red-200",
};

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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AnalizlerimPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const params = new URLSearchParams({
      error: "Analiz geçmişinizi görmek için giriş yapın.",
    });

    redirect(`/login?${params.toString()}`);
  }

  const { data, error } = await supabase
    .from("vehicle_analyses")
    .select(
      `
        id,
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
        result,
        created_at
      `,
    )
    .order("created_at", { ascending: false });

  const analyses = (data ?? []) as SavedAnalysis[];

  return (
    <main className="min-h-screen bg-[#070707] text-[#f5f5f3]">
      <header className="border-b border-[#c8a96a]/20 bg-[#090909]/95 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c8a96a]/35 bg-[#c8a96a]/[0.06] font-black text-[#d6b77b] shadow-[0_10px_35px_rgba(200,169,106,0.08)]">
              CV
            </span>

            <div>
              <p className="font-bold text-[#f5f5f3]">
                CarVision <span className="text-[#d6b77b]">AI</span>
              </p>
              <p className="text-xs text-[#777873]">
                Analiz geçmişi
              </p>
            </div>
          </Link>

          <Link
            href="/#analyze"
            className="rounded-xl border border-[#c8a96a]/35 bg-[#c8a96a]/[0.06] px-4 py-2.5 text-sm font-semibold text-[#d6b77b] transition hover:bg-[#c8a96a]/[0.11]"
          >
            Yeni Analiz
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1450px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#c8a96a]">
            Hesabım
          </p>

          <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">
            Araç Analizlerim
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#969793] sm:text-base">
            Hesabınızla yaptığınız araç analizlerini yeniden görüntüleyin ve
            ilan bilgilerini karşılaştırın.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-5 text-red-200">
            Analiz geçmişi alınırken bir hata oluştu.
          </div>
        ) : analyses.length === 0 ? (
          <div className="rounded-[28px] border border-white/[0.08] bg-[#101113] px-6 py-16 text-center shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c8a96a]/25 bg-[#c8a96a]/[0.06] text-2xl">
              ◇
            </div>

            <h2 className="text-xl font-semibold">
              Henüz kayıtlı analiziniz yok
            </h2>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-[#8f918d]">
              Giriş yaptıktan sonra gerçekleştirdiğiniz yeni araç analizleri
              otomatik olarak burada saklanacaktır.
            </p>

            <Link
              href="/#analyze"
              className="mt-7 inline-flex rounded-xl border border-[#c8a96a]/35 bg-gradient-to-r from-[#c8a96a] to-[#b9985a] px-5 py-3 font-semibold text-[#11100d] transition hover:from-[#d6b77b] hover:to-[#c8a96a]"
            >
              İlk Analizi Yap
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {analyses.map((analysis) => (
              <article
                key={analysis.id}
                className="group rounded-[22px] border border-white/[0.08] bg-[#101113] p-5 shadow-[0_22px_65px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-[#c8a96a]/25"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-[#8f918d]">
                      <span className="text-[#c8a96a]">
                        {analysis.vehicle_year}
                      </span>{" "}
                      • {analysis.vehicle_city}
                    </p>

                    <h2 className="mt-2 truncate text-lg font-semibold tracking-[-0.02em] text-[#f5f5f3]">
                      {analysis.vehicle_brand} {analysis.vehicle_model}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                      recommendationClasses[
                        analysis.purchase_recommendation
                      ]
                    }`}
                  >
                    {
                      recommendationLabels[
                        analysis.purchase_recommendation
                      ]
                    }
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-xl border border-white/[0.05] bg-[#090a0b] p-3">
                    <p className="text-[10px] text-[#666762]">Fiyat</p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatCurrency(analysis.vehicle_price)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-[#090a0b] p-3">
                    <p className="text-[10px] text-[#666762]">
                      Kilometre
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatNumber(analysis.vehicle_mileage)} km
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-[#090a0b] p-3">
                    <p className="text-[10px] text-[#666762]">Puan</p>
                    <p className="mt-1 text-sm font-semibold text-[#d6b77b]">
                      {analysis.score}/100
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.05] bg-[#090a0b] p-3">
                    <p className="text-[10px] text-[#666762]">Güven</p>
                    <p className="mt-1 text-sm font-semibold">
                      %{analysis.analysis_confidence}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                  <p className="text-[11px] text-[#666762]">
                    {formatDate(analysis.created_at)}
                  </p>

                  {analysis.listing_url ? (
                    <a
                      href={analysis.listing_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-[#d6b77b] transition hover:text-[#e2c88f]"
                    >
                      İlanı Aç →
                    </a>
                  ) : (
                    <span className="text-[11px] text-[#555651]">
                      Manuel analiz
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}