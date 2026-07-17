import type {
  AnalysisResult as AnalysisResultType,
  PriceEvaluation,
  PurchaseRecommendation,
} from "../types/analysis";

type AnalysisResultProps = {
  result: AnalysisResultType;
};

const purchaseRecommendationLabels: Record<
  PurchaseRecommendation,
  string
> = {
  strong_buy: "Güçlü Alım Fırsatı",
  buy: "Satın Alınabilir",
  consider: "Dikkatli Değerlendir",
  avoid: "Uzak Dur",
};

const priceEvaluationLabels: Record<PriceEvaluation, string> = {
  very_good: "Çok Avantajlı",
  good: "Avantajlı",
  fair: "Piyasa Değerinde",
  expensive: "Pahalı",
  very_expensive: "Çok Pahalı",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(mileage: number) {
  return new Intl.NumberFormat("tr-TR").format(mileage);
}

export default function AnalysisResult({
  result,
}: AnalysisResultProps) {
  const {
    vehicle,
    score,
    purchaseRecommendation,
    priceAnalysis,
    chronicProblems,
    advantages,
    disadvantages,
    aiComment,
    negotiationAdvice,
    importantChecks,
  } = result;

  const priceDifferenceText =
    priceAnalysis.difference < 0
      ? `${formatPrice(Math.abs(priceAnalysis.difference))} avantajlı`
      : priceAnalysis.difference > 0
        ? `${formatPrice(priceAnalysis.difference)} pahalı`
        : "Piyasa değeriyle aynı";

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              AI Analiz Sonucu
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              {vehicle.year} {vehicle.brand} {vehicle.model}
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              {formatMileage(vehicle.mileage)} km · {vehicle.fuel} ·{" "}
              {vehicle.transmission} · {vehicle.city}
            </p>
          </div>

          <span className="w-fit rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
            {purchaseRecommendationLabels[purchaseRecommendation]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <p className="text-sm text-zinc-500">İlan Fiyatı</p>
          <p className="mt-2 text-xl font-bold text-white">
            {formatPrice(priceAnalysis.listingPrice)}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <p className="text-sm text-zinc-500">Tahmini Piyasa Değeri</p>
          <p className="mt-2 text-xl font-bold text-emerald-400">
            {formatPrice(priceAnalysis.estimatedMarketPrice)}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <p className="text-sm text-zinc-500">Fiyat Değerlendirmesi</p>
          <p className="mt-2 text-lg font-bold text-white">
            {priceEvaluationLabels[priceAnalysis.evaluation]}
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            {priceDifferenceText}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <p className="text-sm text-zinc-500">AI Güven Puanı</p>
          <p className="mt-2 text-xl font-bold text-white">
            {score} / 100
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-6 pb-6 lg:grid-cols-2">
        <ResultList
          title="Artılar"
          items={advantages}
          emptyMessage="Belirgin bir avantaj bulunamadı."
        />

        <ResultList
          title="Eksiler"
          items={disadvantages}
          emptyMessage="Belirgin bir dezavantaj bulunamadı."
        />

        <ResultList
          title="Kronik Sorunlar"
          items={chronicProblems}
          emptyMessage="Bilinen önemli bir kronik sorun bulunamadı."
        />

        <ResultList
          title="Ekspertizde Kontrol Edilecekler"
          items={importantChecks}
          emptyMessage="Ek kontrol önerisi bulunamadı."
        />
      </div>

      <div className="space-y-4 border-t border-zinc-800 p-6">
        <article className="rounded-xl border border-zinc-800 bg-black p-5">
          <h3 className="text-lg font-semibold text-white">AI Yorumu</h3>
          <p className="mt-3 leading-7 text-zinc-400">{aiComment}</p>
        </article>

        <article className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <h3 className="text-lg font-semibold text-emerald-400">
            Pazarlık Tavsiyesi
          </h3>
          <p className="mt-3 leading-7 text-zinc-300">
            {negotiationAdvice}
          </p>
        </article>
      </div>
    </section>
  );
}

type ResultListProps = {
  title: string;
  items: string[];
  emptyMessage: string;
};

function ResultList({
  title,
  items,
  emptyMessage,
}: ResultListProps) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-black p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-zinc-500">{emptyMessage}</p>
      )}
    </article>
  );
}