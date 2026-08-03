import Image from "next/image";
import DownloadPdfButton from "./DownloadPdfButton";

import type {
  AnalysisResult as AnalysisResultType,
  MarketPosition,
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

const marketPositionLabels: Record<MarketPosition, string> = {
  excellent_deal: "Mükemmel Fırsat",
  strong_deal: "Güçlü Fırsat",
  fair_price: "Adil Fiyat",
  slightly_expensive: "Biraz Pahalı",
  overpriced: "Yüksek Fiyatlı",
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
    analysisConfidence,
    purchaseRecommendation,
    priceAnalysis,
    marketAnalysis,
    ownershipCostAnalysis,
    lifetimeAnalysis,
    purchaseRiskAnalysis,
    competitivePositioning,
    negotiationAnalysis,
    descriptionAnalysis,
    photoAnalysis,
    chronicProblems,
    advantages,
    disadvantages,
    aiComment,
    negotiationAdvice,
    importantChecks,
  } = result;

  const priceDifferenceText =
    priceAnalysis.difference < 0
      ? `${formatPrice(
          Math.abs(priceAnalysis.difference)
        )} avantajlı`
      : priceAnalysis.difference > 0
        ? `${formatPrice(priceAnalysis.difference)} pahalı`
        : "Piyasa değeriyle aynı";

  const location = [
    vehicle.city,
    vehicle.district,
    vehicle.neighborhood,
  ]
    .filter(Boolean)
    .join(" / ");

  const quickWarnings = [
    ...disadvantages,
    ...importantChecks,
  ]
    .filter(
      (warning, index, warnings) =>
        warning && warnings.indexOf(warning) === index
    )
    .slice(0, 5);

  const decisionLabel =
    purchaseRecommendation === "strong_buy" ||
    purchaseRecommendation === "buy"
      ? "AL"
      : purchaseRecommendation === "consider"
        ? "DİKKATLİ DEĞERLENDİR"
        : "ALMA";

  const riskLabel =
    purchaseRiskAnalysis.riskLevel === "low"
      ? "Düşük"
      : purchaseRiskAnalysis.riskLevel === "medium"
        ? "Orta"
        : purchaseRiskAnalysis.riskLevel === "high"
          ? "Yüksek"
          : "Çok Yüksek";

  const vehicleDetails = [
    {
      label: "İlan No",
      value: vehicle.listingNumber,
    },
    {
      label: "İlan Tarihi",
      value: vehicle.listingDate,
    },
    {
      label: "Kasa Tipi",
      value: vehicle.bodyType,
    },
    {
      label: "Motor Gücü",
      value: vehicle.enginePower,
    },
    {
      label: "Motor Hacmi",
      value: vehicle.engineVolume,
    },
    {
      label: "Çekiş",
      value: vehicle.traction,
    },
    {
      label: "Renk",
      value: vehicle.color,
    },
    {
      label: "Araç Durumu",
      value: vehicle.vehicleCondition,
    },
    {
      label: "Ağır Hasar",
      value: vehicle.heavyDamage,
    },
    {
      label: "Garanti",
      value: vehicle.warranty,
    },
    {
      label: "Kimden",
      value: vehicle.sellerType,
    },
    {
      label: "Takas",
      value: vehicle.exchange,
    },
    {
      label: "Plaka / Uyruk",
      value: vehicle.plateNationality,
    },
  ].filter((detail) => detail.value);

  const sectionStyle =
  "glass-card rounded-[26px] border border-white/10 p-5 shadow-xl shadow-slate-950/10 transition-all duration-300 hover:border-emerald-400/20 hover:shadow-emerald-500/5 sm:p-6";

return (
    <section className="glass-card mt-8 overflow-hidden rounded-[22px] sm:mt-10 sm:rounded-[28px]">
      <div className="border-b border-white/5 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {vehicle.mainImage && (
            <div className="overflow-hidden rounded-xl border border-slate-600/30 bg-slate-950/45">
              <Image
                  src={vehicle.mainImage}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  width={640}
                  height={256}
                  className="h-64 w-full object-cover"
                  priority
                />
            </div>
          )}

          <div className="flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-400">
                  AI Analiz Sonucu
                </p>

                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  {vehicle.year} {vehicle.brand} {vehicle.model}
                </h2>

                {vehicle.title && (
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {vehicle.title}
                  </p>
                )}

                <p className="mt-3 text-sm text-slate-300">
                  {formatMileage(vehicle.mileage)} km · {vehicle.fuel} ·{" "}
                  {vehicle.transmission}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {location || "Konum bilinmiyor"}
                </p>
              </div>

              <span className="primary-glow w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
                {
                  purchaseRecommendationLabels[
                    purchaseRecommendation
                  ]
                }
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <DownloadPdfButton result={result} />

              {vehicle.listingUrl && (
                <a
                  href={vehicle.listingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-slate-500/35 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-500 hover:text-emerald-400"
                >
                  İlanı Aç
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/5 p-4 sm:p-6">
        <div className="glass-card rounded-3xl border-emerald-400/20 bg-emerald-400/5 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-400">
                Hızlı Karar Özeti
              </p>

              <h3 className="mt-1 text-2xl font-bold text-white">
                {decisionLabel}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="glass-card rounded-2xl px-4 py-3">
                <p className="text-xs text-slate-400">Genel Puan</p>
                <p className="mt-1 font-bold text-white">
                  {score} / 100
                </p>
              </div>

              <div className="glass-card rounded-2xl px-4 py-3">
                <p className="text-xs text-slate-400">Risk</p>
                <p className="mt-1 font-bold text-white">
                  {riskLabel}
                </p>
              </div>

              <div className="glass-card rounded-2xl px-4 py-3">
                <p className="text-xs text-slate-400">Fiyat Avantajı</p>
                <p className="mt-1 font-bold text-white">
                  {competitivePositioning.priceAdvantageScore} / 100
                </p>
              </div>

              <div className="glass-card rounded-2xl px-4 py-3">
                <p className="text-xs text-slate-400">Pazarlık Gücü</p>
                <p className="mt-1 font-bold text-white">
                  %{negotiationAnalysis.negotiationPower}
                </p>
              </div>
            </div>
          </div>

          {quickWarnings.length > 0 && (
            <div className="mt-5 border-t border-slate-600/30 pt-5">
              <p className="text-sm font-semibold text-white">
                En Önemli Uyarılar
              </p>

              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {quickWarnings.map((warning, index) => (
                  <div
                    key={`quick-warning-${index}`}
                    className="flex gap-3 rounded-lg border border-slate-600/30 bg-slate-950/45 p-3 text-sm leading-6 text-slate-300"
                  >
                    <span className="font-semibold text-amber-400">
                      {index + 1}.
                    </span>
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {vehicleDetails.length > 0 && (
        <div className="border-b border-white/5 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white">
            Araç Detayları
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {vehicleDetails.map((detail) => (
              <div
                key={detail.label}
                className="glass-card rounded-2xl p-4"
              >
                <p className="text-xs text-slate-400">
                  {detail.label}
                </p>

                <p className="mt-2 text-sm font-semibold text-zinc-200">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-sm text-slate-400">İlan Fiyatı</p>

          <p className="mt-2 text-xl font-bold text-white">
            {formatPrice(priceAnalysis.listingPrice)}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <p className="text-sm text-slate-400">
            Tahmini Piyasa Değeri
          </p>

          <p className="mt-2 text-xl font-bold text-emerald-400">
            {formatPrice(priceAnalysis.estimatedMarketPrice)}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <p className="text-sm text-slate-400">
            Fiyat Değerlendirmesi
          </p>

          <p className="mt-2 text-lg font-bold text-white">
            {
              priceEvaluationLabels[
                priceAnalysis.evaluation
              ]
            }
          </p>

          <p className="mt-1 text-sm text-slate-300">
            {priceDifferenceText}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            %{Math.abs(priceAnalysis.differencePercentage).toFixed(1)}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <p className="text-sm text-slate-400">Analiz Güven Skoru</p>

          <p className="mt-2 text-xl font-bold text-white">
            %{analysisConfidence}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {analysisConfidence >= 80
              ? "Yüksek güven"
              : analysisConfidence >= 60
                ? "Orta güven"
                : "Sınırlı güven"}
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              style={{
                width: `${Math.min(
                  Math.max(analysisConfidence, 0),
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>


      <section className={`${sectionStyle} mt-6`}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/15 text-xl">
            ⚠️
          </div>

          <div>
            <p className="text-sm font-medium text-emerald-300">
              Satın Alma Analizi
            </p>

            <h3 className="text-xl font-bold text-white">
              Risk Endeksi
            </h3>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-600/30 bg-slate-950/45 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-3xl font-bold text-white">
                {purchaseRiskAnalysis.riskScore} / 100
              </p>

              <p className="mt-1 text-sm text-slate-300">
                {purchaseRiskAnalysis.riskLevel === "low"
                  ? "Düşük Risk"
                  : purchaseRiskAnalysis.riskLevel === "medium"
                    ? "Orta Risk"
                    : purchaseRiskAnalysis.riskLevel === "high"
                      ? "Yüksek Risk"
                      : "Çok Yüksek Risk"}
              </p>
            </div>

            <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-right">
              {purchaseRiskAnalysis.summary}
            </p>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
              style={{
                width: `${Math.min(
                  Math.max(purchaseRiskAnalysis.riskScore, 0),
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </section>

      <section className={`${sectionStyle} mt-6`}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/15 text-xl">
            🔧
          </div>

          <div>
            <p className="text-sm font-medium text-cyan-300">
              Uzun Vadeli Analiz
            </p>

            <h3 className="text-xl font-bold text-white">
              Kullanım Ömrü
            </h3>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Motor", `${lifetimeAnalysis.remainingEngineLifeKm.toLocaleString("tr-TR")} km`],
            ["Şanzıman", `${lifetimeAnalysis.remainingTransmissionLifeKm.toLocaleString("tr-TR")} km`],
            ["Kritik Masraf", `%${lifetimeAnalysis.criticalRepairProbability}`],
            ["Ömür Puanı", `${lifetimeAnalysis.overallLifetimeScore} / 100`],
            [
              "Ağır Bakım Riski",
              lifetimeAnalysis.majorMaintenanceRisk === "high"
                ? "Yüksek"
                : lifetimeAnalysis.majorMaintenanceRisk === "medium"
                  ? "Orta"
                  : "Düşük",
            ],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="glass-card rounded-2xl p-4"
            >
              <p className="text-xs text-slate-400">{label}</p>
              <p className="mt-2 font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`${sectionStyle} mt-6`}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/15 text-xl">
            💳
          </div>

          <div>
            <p className="text-sm font-medium text-emerald-300">
              Maliyet Analizi
            </p>

            <h3 className="text-xl font-bold text-white">
              Yıllık Sahip Olma Maliyeti
            </h3>
          </div>
        </div>

        <p className="text-sm font-medium text-emerald-400">
          Tahmini yıllık giderler
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Bakım", ownershipCostAnalysis.annualMaintenanceCost],
            ["Yakıt", ownershipCostAnalysis.annualFuelCost],
            ["MTV", ownershipCostAnalysis.annualTaxEstimate],
            ["Sigorta / Kasko", ownershipCostAnalysis.annualInsuranceEstimate],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="glass-card rounded-2xl p-4"
            >
              <p className="text-xs text-slate-400">{label}</p>
              <p className="mt-2 font-semibold text-white">
                {Number(value).toLocaleString("tr-TR")} TL
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-xs text-amber-400">
              Olası Büyük Onarım
            </p>
            <p className="mt-2 font-semibold text-white">
              {ownershipCostAnalysis.potentialMajorRepairCost.toLocaleString("tr-TR")} TL
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <p className="text-xs text-slate-400">
              3 Yıllık Değer Kaybı
            </p>
            <p className="mt-2 font-semibold text-white">
              {ownershipCostAnalysis.threeYearDepreciation.toLocaleString("tr-TR")} TL
            </p>
          </div>

          <div className="glass-card rounded-2xl border-emerald-400/20 bg-emerald-400/5 p-4">
            <p className="text-xs text-emerald-400">
              Yıllık Toplam
            </p>
            <p className="mt-2 text-lg font-bold text-white">
              {ownershipCostAnalysis.annualTotalCost.toLocaleString("tr-TR")} TL
            </p>
          </div>
        </div>
      </section>

      <section className={`${sectionStyle} mt-6`}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/15 text-xl">
            📊
          </div>

          <div>
            <p className="text-sm font-medium text-violet-300">
              Piyasa Analizi
            </p>

            <h3 className="text-xl font-bold text-white">
              Rekabet Konumu
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              Rekabet Konumlandırması
            </p>

            <h3 className="mt-1 text-xl font-semibold text-white">
              {marketPositionLabels[
                competitivePositioning.marketPosition
              ]}
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              {competitivePositioning.summary}
            </p>
          </div>

          <div className="mt-3 flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 sm:mt-0">
            <span className="text-2xl font-bold text-white">
              {competitivePositioning.priceAdvantageScore}
            </span>
            <span className="text-xs text-emerald-400">
              Fiyat Skoru
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MarketStatCard
            label="Fiyat Sıralaması"
            value={
              competitivePositioning.priceRank > 0
                ? `${competitivePositioning.priceRank}. / ${competitivePositioning.totalComparableCount}`
                : "Veri yok"
            }
          />

          <MarketStatCard
            label="Daha Ucuz Olduğu Emsaller"
            value={`%${competitivePositioning.cheaperThanPercentage}`}
            highlighted
          />

          <MarketStatCard
            label="Fiyat Yüzdelik Dilimi"
            value={`%${competitivePositioning.pricePercentile}`}
          />

          <MarketStatCard
            label="Piyasa Konumu"
            value={
              marketPositionLabels[
                competitivePositioning.marketPosition
              ]
            }
          />
        </div>
      </section>

      <div className="border-t border-white/5 p-4 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              Emsal Piyasa Analizi
            </p>

            <h3 className="mt-1 text-xl font-semibold text-white">
              Piyasa Karşılaştırması
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Benzer model yılı, kilometre ve fiyat aralığındaki araçlar
              karşılaştırılmıştır.
            </p>
          </div>

          <div className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
            %{marketAnalysis.confidence} güven
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <MarketStatCard
            label="Emsal Sayısı"
            value={`${marketAnalysis.comparableCount} araç`}
          />

          <MarketStatCard
            label="En Düşük"
            value={formatPrice(marketAnalysis.lowestPrice)}
          />

          <MarketStatCard
            label="En Yüksek"
            value={formatPrice(marketAnalysis.highestPrice)}
          />

          <MarketStatCard
            label="Ortalama"
            value={formatPrice(marketAnalysis.averagePrice)}
            highlighted
          />

          <MarketStatCard
            label="Medyan"
            value={formatPrice(marketAnalysis.medianPrice)}
          />
        </div>

        {marketAnalysis.comparableVehicles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-200">
              Karşılaştırılan Emsal Araçlar
            </h4>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {marketAnalysis.comparableVehicles.map(
                (comparableVehicle, index) => (
                  <article
                    key={`${comparableVehicle.title}-${index}`}
                    className="glass-card rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">
                          {comparableVehicle.title}
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          {formatMileage(
                            comparableVehicle.mileage
                          )}{" "}
                          km · {comparableVehicle.city}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-lg bg-slate-800/55 px-3 py-2 text-sm font-bold text-emerald-400">
                        {formatPrice(comparableVehicle.price)}
                      </span>
                    </div>

                    {comparableVehicle.url && (
                      <a
                        href={comparableVehicle.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex text-sm font-semibold text-slate-300 transition hover:text-emerald-400"
                      >
                        Emsal ilanı aç
                      </a>
                    )}
                  </article>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/5 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              İlan Açıklaması Analizi
            </p>

            <h3 className="mt-1 text-xl font-semibold text-white">
              Risk ve Satıcı Beyanı Değerlendirmesi
            </h3>
          </div>

          <div
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              descriptionAnalysis.riskLevel === "high"
                ? "bg-red-500/15 text-red-400"
                : descriptionAnalysis.riskLevel === "medium"
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-emerald-500/15 text-emerald-400"
            }`}
          >
            {descriptionAnalysis.riskLevel === "high"
              ? "Yüksek Risk"
              : descriptionAnalysis.riskLevel === "medium"
                ? "Orta Risk"
                : "Düşük Risk"}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">
              Açıklama Risk Puanı
            </p>

            <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
              {descriptionAnalysis.riskScore} / 100
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full rounded-full ${
                  descriptionAnalysis.riskLevel === "high"
                    ? "bg-red-500"
                    : descriptionAnalysis.riskLevel === "medium"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{
                  width: `${descriptionAnalysis.riskScore}%`,
                }}
              />
            </div>
          </article>

          <article className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">
              Genel Değerlendirme
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-200">
              {descriptionAnalysis.summary}
            </p>
          </article>
        </div>

        {descriptionAnalysis.warnings.length > 0 && (
          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <h4 className="font-semibold text-red-400">
              Tespit Edilen Riskler
            </h4>

            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {descriptionAnalysis.warnings.map((warning, index) => (
                <li
                  key={`description-warning-${index}`}
                  className="flex gap-3"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {descriptionAnalysis.positiveSignals.length > 0 && (
          <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <h4 className="font-semibold text-emerald-400">
              Olumlu Satıcı Beyanları
            </h4>

            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {descriptionAnalysis.positiveSignals.map((signal, index) => (
                <li
                  key={`description-signal-${index}`}
                  className="flex gap-3"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {descriptionAnalysis.detectedKeywords.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-slate-200">
              Tespit Edilen İfadeler
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {descriptionAnalysis.detectedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-slate-500/35 bg-slate-950/45 px-3 py-1 text-xs text-slate-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/5 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              Fotoğraf Analizi
            </p>

            <h3 className="mt-1 text-xl font-semibold text-white">
              Görsel Kapsam ve Kondisyon Değerlendirmesi
            </h3>
          </div>

          <div
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              photoAnalysis.conditionLevel === "good"
                ? "bg-emerald-500/15 text-emerald-400"
                : photoAnalysis.conditionLevel === "medium"
                  ? "bg-amber-500/15 text-amber-400"
                  : photoAnalysis.conditionLevel === "poor"
                    ? "bg-red-500/15 text-red-400"
                    : "bg-zinc-700 text-slate-200"
            }`}
          >
            {photoAnalysis.conditionLevel === "good"
              ? "İyi Kapsam"
              : photoAnalysis.conditionLevel === "medium"
                ? "Orta Kapsam"
                : photoAnalysis.conditionLevel === "poor"
                  ? "Yetersiz Kapsam"
                  : "Değerlendirilemedi"}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MarketStatCard
            label="Toplam Fotoğraf"
            value={`${photoAnalysis.photoCount}`}
          />

          <MarketStatCard
            label="Kapsam Puanı"
            value={`${photoAnalysis.coverageScore} / 100`}
            highlighted
          />
        </div>

        <article className="mt-5 rounded-xl border border-slate-600/30 bg-slate-950/45 p-5">
          <p className="text-sm text-slate-400">
            Genel Fotoğraf Değerlendirmesi
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-200">
            {photoAnalysis.summary}
          </p>
        </article>

        {photoAnalysis.visualFindings.length > 0 && (
          <div className="mt-5 rounded-xl border border-slate-500/35 bg-slate-900/45 p-5">
            <h4 className="font-semibold text-white">
              Görsel Ekspertiz Bulguları
            </h4>

            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {photoAnalysis.visualFindings.map((finding, index) => (
                <li
                  key={`visual-finding-${index}`}
                  className="flex gap-3"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {photoAnalysis.warnings.length > 0 && (
          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <h4 className="font-semibold text-amber-400">
              Fotoğraf Eksikleri
            </h4>

            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {photoAnalysis.warnings.map((warning, index) => (
                <li
                  key={`photo-warning-${index}`}
                  className="flex gap-3"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {photoAnalysis.positiveSignals.length > 0 && (
          <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <h4 className="font-semibold text-emerald-400">
              Olumlu Fotoğraf Bulguları
            </h4>

            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              {photoAnalysis.positiveSignals.map((signal, index) => (
                <li
                  key={`photo-signal-${index}`}
                  className="flex gap-3"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {vehicle.thumbnailImages &&
          vehicle.thumbnailImages.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-200">
                İlan Fotoğrafları
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {vehicle.thumbnailImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="overflow-hidden rounded-xl border border-slate-600/30 bg-slate-950/45"
                  >
                    <Image
                      src={image}
                      alt={`Araç fotoğrafı ${index + 1}`}
                      width={300}
                     height={200}
                      className="h-32 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
          title="Motor ve Kronik Riskler"
          items={chronicProblems}
          emptyMessage="Bu araç için eşleşen özel motor veya kronik risk bulunamadı."
        />

        <ResultList
          title="Ekspertizde Kontrol Edilecekler"
          items={importantChecks}
          emptyMessage="Ek kontrol önerisi bulunamadı."
        />
      </div>

      <div className="space-y-4 border-t border-slate-600/30 p-6">
        <article className="glass-card rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white">
            AI Yorumu
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {aiComment
              .split(" | ")
              .map((section, index) => {
                const [title, ...contentParts] =
                  section.split(":");

                return (
                  <div
                    key={`ai-section-${index}`}
                    className="glass-card rounded-xl p-4"
                  >
                    <h4 className="font-medium text-white">
                      {title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {contentParts.join(":").trim()}
                    </p>
                  </div>
                );
              })}
          </div>
        </article>

        <article className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-400">
                Akıllı Pazarlık Motoru
              </p>

              <h3 className="mt-1 text-lg font-semibold text-white">
                Pazarlık Gücü: %{negotiationAnalysis.negotiationPower}
              </h3>
            </div>

            <div className="rounded-full border border-emerald-500/20 bg-slate-950/45 px-4 py-2 text-sm font-semibold text-emerald-400">
              {formatPrice(negotiationAnalysis.negotiationMargin)} pazarlık alanı
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MarketStatCard
              label="İlk Teklif"
              value={formatPrice(
                negotiationAnalysis.suggestedOfferPrice
              )}
            />

            <MarketStatCard
              label="Hedef Alım Fiyatı"
              value={formatPrice(
                negotiationAnalysis.targetPurchasePrice
              )}
              highlighted
            />

            <MarketStatCard
              label="Maksimum Ödeme"
              value={formatPrice(
                negotiationAnalysis.maximumPurchasePrice
              )}
            />
          </div>

          <p className="mt-5 leading-7 text-slate-200">
            {negotiationAnalysis.strategy}
          </p>

          <div className="mt-5">
            <h4 className="text-sm font-semibold text-white">
              Pazarlık Gerekçeleri
            </h4>

            <ul className="mt-3 space-y-2">
              {negotiationAnalysis.arguments.map(
                (argument, index) => (
                  <li
                    key={`negotiation-argument-${index}`}
                    className="flex gap-3 text-sm leading-6 text-slate-300"
                  >
                    <span className="text-emerald-400">•</span>
                    <span>{argument}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="mt-5 rounded-lg border border-slate-600/30 bg-slate-950/45 p-4">
            <p className="text-xs font-medium text-slate-400">
              Genel Tavsiye
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-200">
              {negotiationAdvice}
            </p>
          </div>
        </article>

        {vehicle.description && (
          <article className="glass-card rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-white">
              İlan Açıklaması
            </h3>

            <p className="mt-3 whitespace-pre-line leading-7 text-slate-300">
              {vehicle.description}
            </p>
          </article>
        )}
      </div>
    </section>
  );
}


type MarketStatCardProps = {
  label: string;
  value: string;
  highlighted?: boolean;
};

function MarketStatCard({
  label,
  value,
  highlighted = false,
}: MarketStatCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlighted
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-slate-600/30 bg-slate-950/45"
      }`}
    >
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-base font-bold ${
          highlighted ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
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
    <article className="glass-card rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="flex gap-3"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-400">
          {emptyMessage}
        </p>
      )}
    </article>
  );
}