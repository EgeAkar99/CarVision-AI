import AnalysisForm from "./AnalysisForm";

const features = [
  {
    title: "Gerçek piyasa verisi",
    description:
      "Benzer ilanları fiyat, yıl ve kilometre bilgilerine göre karşılaştırır.",
  },
  {
    title: "Risk odaklı analiz",
    description:
      "Kronik sorunlar, satın alma riski ve kritik kontrolleri tek raporda sunar.",
  },
  {
    title: "Akıllı pazarlık",
    description:
      "İlk teklif, hedef alım fiyatı ve maksimum ödeme sınırını hesaplar.",
  },
];

const steps = [
  {
    number: "01",
    title: "İlanı aktar",
    description:
      "Sahibinden ilanını tarayıcı eklentisiyle aktar veya araç bilgilerini manuel gir.",
  },
  {
    number: "02",
    title: "AI analiz etsin",
    description:
      "CarVision AI fiyatı, emsalleri, riskleri ve araç özelliklerini birlikte değerlendirir.",
  },
  {
    number: "03",
    title: "Kararını ver",
    description:
      "Alım kararı, pazarlık stratejisi ve kontrol listesiyle daha bilinçli hareket et.",
  },
];

export default function Hero() {
  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden border-b border-white/5"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="relative mx-auto flex min-h-[720px] w-full max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400">
            Yapay zekâ destekli araç satın alma asistanı
          </div>

          <h1 className="mx-auto mt-8 w-full max-w-5xl text-balance text-center text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            İkinci el araç alırken
            <span className="mx-auto block text-center text-emerald-400">
              tahminle değil, veriyle karar ver
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-balance text-center text-base leading-8 text-zinc-400 sm:text-lg">
            CarVision AI; ilan fiyatını, emsal araçları, riskleri, kullanım
            maliyetini ve pazarlık fırsatını tek raporda değerlendirir.
          </p>

          <div className="mx-auto mt-10 flex w-full flex-wrap items-center justify-center gap-3 text-center text-sm text-zinc-400">
            {[
              "Gerçek emsal analizi",
              "Satın alma risk skoru",
              "Akıllı pazarlık motoru",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2"
              >
                {item}
              </span>
            ))}
          </div>

          <div id="analyze" className="mx-auto w-full max-w-4xl scroll-mt-28">
            <AnalysisForm />
          </div>

          <p className="mt-5 text-xs leading-5 text-zinc-600">
            Analiz sonuçları bilgilendirme amaçlıdır. Satın almadan önce
            bağımsız ekspertiz ve servis geçmişi kontrolü yapılmalıdır.
          </p>
        </div>
      </section>

      <section id="features" className="border-b border-white/5 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-emerald-400">
              Neden CarVision AI?
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Araç ilanını kapsamlı bir satın alma raporuna dönüştür
            </h2>

            <p className="mt-5 leading-7 text-zinc-400">
              Yalnızca fiyat karşılaştırması değil; risk, maliyet ve pazarlık
              açısından bütünsel değerlendirme sunar.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-zinc-800 bg-black p-6 transition hover:-translate-y-1 hover:border-emerald-500/30"
              >
                <div className="h-10 w-10 rounded-xl border border-emerald-500/20 bg-emerald-500/10" />

                <h3 className="mt-6 text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <p className="text-sm font-semibold text-emerald-400">
              Nasıl çalışır?
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Üç adımda araç analizi
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
              >
                <p className="text-3xl font-black text-emerald-500/40">
                  {step.number}
                </p>

                <h3 className="mt-5 text-xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
