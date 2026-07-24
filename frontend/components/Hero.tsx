import AnalysisForm from "./AnalysisForm";

const highlights = [
  {
    value: "Gerçek",
    label: "Emsal analizi",
  },
  {
    value: "Tek",
    label: "Karar paneli",
  },
  {
    value: "Akıllı",
    label: "Pazarlık motoru",
  },
  {
    value: "Detaylı",
    label: "Risk raporu",
  },
];

const features = [
  {
    title: "Piyasa karşılaştırması",
    description:
      "Benzer araçları fiyat, model yılı ve kilometre verilerine göre karşılaştırır.",
  },
  {
    title: "Satın alma riski",
    description:
      "İlan açıklaması, fotoğraflar, kronik sorunlar ve araç geçmişi üzerinden risk üretir.",
  },
  {
    title: "Pazarlık stratejisi",
    description:
      "İlk teklif, hedef alım fiyatı ve aşılmaması gereken maksimum fiyatı hesaplar.",
  },
];

const steps = [
  {
    number: "01",
    title: "İlanı aktar",
    description:
      "Tarayıcı eklentisiyle ilanı aktar veya araç bilgilerini manuel olarak gir.",
  },
  {
    number: "02",
    title: "Analizi başlat",
    description:
      "CarVision AI fiyatı, emsalleri, riskleri ve maliyetleri birlikte değerlendirir.",
  },
  {
    number: "03",
    title: "Kararını ver",
    description:
      "Tek ekrandan alım kararı, pazarlık gücü ve önemli kontrolleri gör.",
  },
];

export default function Hero() {
  return (
    <>
      <section
        id="home"
        className="relative overflow-hidden border-b border-white/5"
      >
        <div className="hero-glow" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
          <div className="mx-auto max-w-5xl text-center">
            <div className="glass-card animate-fade-up mx-auto inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2 text-center text-[11px] font-semibold text-emerald-300 sm:px-5 sm:py-2.5 sm:text-xs">
              <span className="animate-pulse-soft h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
              Yapay zekâ destekli araç satın alma asistanı
            </div>

            <h1 className="hero-title-shadow animate-fade-up-delay-1 mx-auto mt-5 max-w-4xl text-balance text-[38px] font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl lg:text-[62px]">
              İkinci el araç alırken
              <span className="mt-2 block bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                tahminle değil, veriyle karar ver
              </span>
            </h1>

            <p className="animate-fade-up-delay-2 mx-auto mt-4 max-w-2xl text-balance text-sm leading-6 text-slate-200 sm:text-lg sm:leading-7">
              CarVision AI; ilan fiyatını, gerçek emsalleri, riskleri,
              kullanım maliyetini ve pazarlık fırsatını tek raporda
              değerlendirir.
            </p>

            <div className="animate-fade-up-delay-2 mt-6 flex flex-wrap items-center justify-center gap-3">
              {[
                "Gerçek emsal analizi",
                "Satın alma risk skoru",
                "Akıllı pazarlık motoru",
              ].map((item) => (
                <span
                  key={item}
                  className="glass-card rounded-full px-3 py-2 text-xs text-slate-200 sm:px-4 sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            id="analyze"
            className="animate-fade-up-delay-3 relative mx-auto mt-7 max-w-5xl scroll-mt-28"
          >
            <div className="pointer-events-none absolute -inset-8 rounded-[40px] bg-gradient-to-r from-emerald-400/10 via-cyan-400/5 to-blue-500/10 blur-3xl" />

            <div className="glass-card relative rounded-[26px] border border-white/10 p-3 shadow-2xl shadow-slate-950/30 sm:rounded-[32px] sm:p-6">
              <div className="mb-5 flex flex-col gap-3 border-b border-white/5 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-left">
                  <p className="text-sm font-semibold text-emerald-300">
                    Araç Analizi
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-white sm:text-2xl">
                    İlanı birkaç saniye içinde analiz et
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="animate-pulse-soft h-2 w-2 rounded-full bg-emerald-400" />
                  Sistem hazır
                </div>
              </div>

              <AnalysisForm />
            </div>
          </div>

          <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-5 text-slate-500">
            Analiz sonuçları bilgilendirme amaçlıdır. Satın almadan önce
            bağımsız ekspertiz, tramer ve servis geçmişi kontrolü
            yapılmalıdır.
          </p>

          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
            {highlights.map((item) => (
              <article
                key={item.label}
                className="glass-card rounded-2xl px-5 py-4 text-center"
              >
                <p className="text-lg font-bold text-white">
                  {item.value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {item.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-b border-white/5 bg-slate-900/20"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-emerald-300">
              Neden CarVision AI?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              İlanı yalnızca inceleme, gerçekten değerlendir
            </h2>

            <p className="mt-5 leading-7 text-slate-300">
              Fiyat, risk, maliyet ve pazarlık gücünü tek bir analiz
              içerisinde birleştirir.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="glass-card group rounded-3xl p-6 transition duration-300 hover:-translate-y-1.5 hover:border-emerald-400/30"
              >
                <div className="primary-glow flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 text-sm font-black text-emerald-300">
                  0{index + 1}
                </div>

                <h3 className="mt-6 text-lg font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-emerald-300">
              Nasıl çalışır?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Üç adımda daha bilinçli karar
            </h2>
          </div>

          <div className="relative mt-12 grid gap-5 lg:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent lg:block" />

            {steps.map((step) => (
              <article
                key={step.number}
                className="glass-card relative rounded-3xl p-6"
              >
                <div className="primary-glow flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-slate-900/60 text-xl font-black text-emerald-300">
                  {step.number}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
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
