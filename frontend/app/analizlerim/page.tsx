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
  strong_buy: "Güçlü Alım Fırsatı",
  buy: "Satın Alınabilir",
  consider: "Dikkatli Değerlendir",
  avoid: "Uzak Dur",
};

const recommendationClasses: Record<
  PurchaseRecommendation,
  string
> = {
  strong_buy:
    "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  buy: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  consider:
    "border-amber-400/30 bg-amber-400/10 text-amber-300",
  avoid: "border-red-400/30 bg-red-400/10 text-red-300",
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
    redirect("/login?error=Analiz geçmişinizi görmek için giriş yapın.");
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
      `
    )
    .order("created_at", { ascending: false });

  const analyses = (data ?? []) as SavedAnalysis[];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="primary-glow flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 font-black text-emerald-300">
              CV
            </span>

            <div>
              <p className="font-bold">
                CarVision <span className="text-emerald-400">AI</span>
              </p>
              <p className="text-xs text-slate-400">
                Analiz geçmişi
              </p>
            </div>
          </Link>

          <Link
            href="/#analyze"
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
          >
            Yeni Analiz
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Hesabım
          </p>

          <h1 className="text-3xl font-black sm:text-4xl">
            Araç Analizlerim
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Hesabınızla yaptığınız araç analizlerini yeniden
            görüntüleyin ve ilan bilgilerini karşılaştırın.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-red-200">
            Analiz geçmişi alınırken bir hata oluştu.
          </div>
        ) : analyses.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-16 text-center shadow-2xl shadow-black/20">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl">
              🚘
            </div>

            <h2 className="text-xl font-bold">
              Henüz kayıtlı analiziniz yok
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-slate-400">
              Giriş yaptıktan sonra gerçekleştirdiğiniz yeni araç
              analizleri otomatik olarak burada saklanacaktır.
            </p>

            <Link
              href="/#analyze"
              className="mt-7 inline-flex rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              İlk Analizi Yap
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {analyses.map((analysis) => (
              <article
                key={analysis.id}
                className="rounded-3xl border border-white/10 bg-slate-900/65 p-6 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-400/20"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">
                      {analysis.vehicle_year} •{" "}
                      {analysis.vehicle_city}
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                      {analysis.vehicle_brand}{" "}
                      {analysis.vehicle_model}
                    </h2>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
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

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl bg-slate-950/50 p-3">
                    <p className="text-xs text-slate-500">Fiyat</p>
                    <p className="mt-1 text-sm font-bold">
                      {formatCurrency(analysis.vehicle_price)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950/50 p-3">
                    <p className="text-xs text-slate-500">Kilometre</p>
                    <p className="mt-1 text-sm font-bold">
                      {formatNumber(analysis.vehicle_mileage)} km
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950/50 p-3">
                    <p className="text-xs text-slate-500">Puan</p>
                    <p className="mt-1 text-sm font-bold text-emerald-300">
                      {analysis.score}/100
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-950/50 p-3">
                    <p className="text-xs text-slate-500">Güven</p>
                    <p className="mt-1 text-sm font-bold">
                      %{analysis.analysis_confidence}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                  <p className="text-xs text-slate-500">
                    {formatDate(analysis.created_at)}
                  </p>

                  {analysis.listing_url ? (
                    <a
                      href={analysis.listing_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
                    >
                      İlanı Aç →
                    </a>
                  ) : (
                    <span className="text-xs text-slate-600">
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
