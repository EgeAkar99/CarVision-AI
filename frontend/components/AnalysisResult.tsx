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
    marketAnalysis,
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

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {vehicle.mainImage && (
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black">
              <img
                src={vehicle.mainImage}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="h-64 w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-400">
                  AI Analiz Sonucu
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  {vehicle.year} {vehicle.brand} {vehicle.model}
                </h2>

                {vehicle.title && (
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {vehicle.title}
                  </p>
                )}

                <p className="mt-3 text-sm text-zinc-400">
                  {formatMileage(vehicle.mileage)} km · {vehicle.fuel} ·{" "}
                  {vehicle.transmission}
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  {location || "Konum bilinmiyor"}
                </p>
              </div>

              <span className="w-fit rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
                {
                  purchaseRecommendationLabels[
                    purchaseRecommendation
                  ]
                }
              </span>
            </div>

            {vehicle.listingUrl && (
              <a
                href={vehicle.listingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-fit rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-emerald-500 hover:text-emerald-400"
              >
                İlanı Aç
              </a>
            )}
          </div>
        </div>
      </div>

      {vehicleDetails.length > 0 && (
        <div className="border-b border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-white">
            Araç Detayları
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {vehicleDetails.map((detail) => (
              <div
                key={detail.label}
                className="rounded-xl border border-zinc-800 bg-black p-4"
              >
                <p className="text-xs text-zinc-500">
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

      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <p className="text-sm text-zinc-500">İlan Fiyatı</p>

          <p className="mt-2 text-xl font-bold text-white">
            {formatPrice(priceAnalysis.listingPrice)}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <p className="text-sm text-zinc-500">
            Tahmini Piyasa Değeri
          </p>

          <p className="mt-2 text-xl font-bold text-emerald-400">
            {formatPrice(priceAnalysis.estimatedMarketPrice)}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-black p-4">
          <p className="text-sm text-zinc-500">
            Fiyat Değerlendirmesi
          </p>

          <p className="mt-2 text-lg font-bold text-white">
            {
              priceEvaluationLabels[
                priceAnalysis.evaluation
              ]
            }
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            {priceDifferenceText}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            %{Math.abs(priceAnalysis.differencePercentage).toFixed(1)}
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
              style={{
                width: `${Math.min(
                  Math.max(score, 0),
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>


      <div className="border-t border-zinc-800 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">
              Emsal Piyasa Analizi
            </p>

            <h3 className="mt-1 text-xl font-semibold text-white">
              Piyasa Karşılaştırması
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
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
            <h4 className="text-sm font-semibold text-zinc-300">
              Karşılaştırılan Emsal Araçlar
            </h4>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {marketAnalysis.comparableVehicles.map(
                (comparableVehicle, index) => (
                  <article
                    key={`${comparableVehicle.title}-${index}`}
                    className="rounded-xl border border-zinc-800 bg-black p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">
                          {comparableVehicle.title}
                        </p>

                        <p className="mt-2 text-sm text-zinc-500">
                          {formatMileage(
                            comparableVehicle.mileage
                          )}{" "}
                          km · {comparableVehicle.city}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-bold text-emerald-400">
                        {formatPrice(comparableVehicle.price)}
                      </span>
                    </div>

                    {comparableVehicle.url && (
                      <a
                        href={comparableVehicle.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex text-sm font-semibold text-zinc-400 transition hover:text-emerald-400"
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


      <div className="border-t border-zinc-800 p-6">
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
          <article className="rounded-xl border border-zinc-800 bg-black p-5">
            <p className="text-sm text-zinc-500">
              Açıklama Risk Puanı
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
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

          <article className="rounded-xl border border-zinc-800 bg-black p-5">
            <p className="text-sm text-zinc-500">
              Genel Değerlendirme
            </p>

            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {descriptionAnalysis.summary}
            </p>
          </article>
        </div>

        {descriptionAnalysis.warnings.length > 0 && (
          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <h4 className="font-semibold text-red-400">
              Tespit Edilen Riskler
            </h4>

            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
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

            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
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
            <p className="text-sm font-semibold text-zinc-300">
              Tespit Edilen İfadeler
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {descriptionAnalysis.detectedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-zinc-700 bg-black px-3 py-1 text-xs text-zinc-400"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800 p-6">
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
                    : "bg-zinc-700 text-zinc-300"
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

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <MarketStatCard
            label="Toplam Fotoğraf"
            value={`${photoAnalysis.photoCount}`}
          />

          <MarketStatCard
            label="Dış Mekân"
            value={`${photoAnalysis.exteriorPhotoCount}`}
          />

          <MarketStatCard
            label="İç Mekân"
            value={`${photoAnalysis.interiorPhotoCount}`}
          />

          <MarketStatCard
            label="Kapsam Puanı"
            value={`${photoAnalysis.coverageScore} / 100`}
            highlighted
          />
        </div>

        <article className="mt-5 rounded-xl border border-zinc-800 bg-black p-5">
          <p className="text-sm text-zinc-500">
            Genel Fotoğraf Değerlendirmesi
          </p>

          <p className="mt-3 text-sm leading-6 text-zinc-300">
            {photoAnalysis.summary}
          </p>
        </article>

        {photoAnalysis.warnings.length > 0 && (
          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
            <h4 className="font-semibold text-amber-400">
              Fotoğraf Eksikleri
            </h4>

            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
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

            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
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
              <p className="text-sm font-semibold text-zinc-300">
                İlan Fotoğrafları
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {vehicle.thumbnailImages.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="overflow-hidden rounded-xl border border-zinc-800 bg-black"
                  >
                    <img
                      src={image}
                      alt={`Araç fotoğrafı ${index + 1}`}
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

      <div className="space-y-4 border-t border-zinc-800 p-6">
        <article className="rounded-xl border border-zinc-800 bg-black p-5">
          <h3 className="text-lg font-semibold text-white">
            AI Yorumu
          </h3>

          <p className="mt-3 leading-7 text-zinc-400">
            {aiComment}
          </p>
        </article>

        <article className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <h3 className="text-lg font-semibold text-emerald-400">
            Pazarlık Tavsiyesi
          </h3>

          <p className="mt-3 leading-7 text-zinc-300">
            {negotiationAdvice}
          </p>
        </article>

        {vehicle.description && (
          <article className="rounded-xl border border-zinc-800 bg-black p-5">
            <h3 className="text-lg font-semibold text-white">
              İlan Açıklaması
            </h3>

            <p className="mt-3 whitespace-pre-line leading-7 text-zinc-400">
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
          : "border-zinc-800 bg-black"
      }`}
    >
      <p className="text-xs text-zinc-500">
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
    <article className="rounded-xl border border-zinc-800 bg-black p-5">
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
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
        <p className="mt-4 text-sm text-zinc-500">
          {emptyMessage}
        </p>
      )}
    </article>
  );
}