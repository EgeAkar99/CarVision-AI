import AnalysisForm from "./AnalysisForm";

const insights = [
  {
    value: "01",
    title: "Piyasa Konumu",
    description:
      "İlan fiyatını benzer araçlarla karşılaştırır ve aracın piyasadaki yerini gösterir.",
  },
  {
    value: "02",
    title: "Risk Endeksi",
    description:
      "İlan açıklaması, kronik sorunlar ve araç bilgilerini birlikte değerlendirir.",
  },
  {
    value: "03",
    title: "Maliyet Görünümü",
    description:
      "Bakım, yakıt, vergi, sigorta ve olası onarım giderlerini tek raporda toplar.",
  },
  {
    value: "04",
    title: "Pazarlık Gücü",
    description:
      "İlk teklif, hedef fiyat ve aşılmaması gereken üst sınırı hesaplar.",
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
      "CarVision AI fiyatı, emsalleri, riskleri ve uzun vadeli maliyetleri birlikte değerlendirir.",
  },
  {
    number: "03",
    title: "Sonucu değerlendir",
    description:
      "Karar destek sonucunu, pazarlık aralığını ve kontrol edilmesi gereken noktaları gör.",
  },
];

const analysisItems = [
  "Piyasa analizi",
  "Satın alma riski",
  "Kronik sorunlar",
  "Sahip olma maliyeti",
  "Kullanım ömrü",
  "Pazarlık stratejisi",
];

export default function Hero() {
  return (
    <>
      <section
        id="home"
        className="relative min-h-[88vh] overflow-hidden border-b border-white/5"
      >
        <div className="hero-glow" />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[100px]" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28">
          <div className="mx-auto max-w-5xl text-center">
            <div className="glass-card animate-fade-up mx-auto inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[11px] font-semibold text-emerald-300 sm:px-5 sm:py-2.5 sm:text-xs">
              <span className="animate-pulse-soft h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
              Yapay zekâ destekli araç karar platformu
            </div>

            <p className="animate-fade-up-delay-1 mt-8 text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
              CarVision AI
            </p>

            <h1 className="hero-title-shadow animate-fade-up-delay-1 mx-auto mt-5 max-w-5xl text-balance text-[44px] font-black leading-[0.96] tracking-[-0.055em] text-white sm:text-6xl lg:text-[84px]">
              Karar vermeden önce
              <span className="mt-3 block bg-gradient-to-r from-emerald-200 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                aracı gerçekten tanıyın.
              </span>
            </h1>

            <p className="animate-fade-up-delay-2 mx-auto mt-7 max-w-2xl text-balance text-base leading-7 text-slate-300 sm:text-xl sm:leading-8">
              Fiyat, risk, maliyet ve piyasa konumunu tek raporda
              değerlendiren modern araç analiz deneyimi.
            </p>

            <div className="animate-fade-up-delay-3 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#analyze"
                className="primary-glow inline-flex min-w-44 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300"
              >
                Analize Başla
              </a>

              <a
                href="#experience"
                className="inline-flex min-w-44 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Nasıl Çalışır?
              </a>
            </div>
          </div>

          <div className="mx-auto mt-16 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Fiyat", "Piyasa karşılaştırması"],
              ["Risk", "Karar destek analizi"],
              ["Maliyet", "Uzun vadeli görünüm"],
              ["Pazarlık", "Hedef fiyat aralığı"],
            ].map(([title, description]) => (
              <div
                key={title}
                className="glass-card rounded-2xl border border-white/10 p-4 text-left"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-5 text-slate-300">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="experience"
        className="relative overflow-hidden border-b border-white/5 bg-slate-900/20"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Fiyattan fazlasını görün
            </p>

            <h2 className="mt-6 text-balance text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-6xl">
              Tek bir ilan.
              <span className="block text-slate-400">
                Birden fazla karar katmanı.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              CarVision AI yalnızca aracın pahalı veya uygun olduğunu
              söylemez. Fiyatı, riski, kronik sorunları, maliyetleri ve
              pazarlık alanını birlikte yorumlar.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {insights.map((insight) => (
              <article
                key={insight.title}
                className="glass-card group min-h-64 rounded-[30px] border border-white/10 p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 sm:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-bold tracking-[0.24em] text-emerald-300">
                    {insight.value}
                  </span>
                  <span className="text-2xl text-slate-600 transition group-hover:text-emerald-300">
                    ↗
                  </span>
                </div>

                <div className="mt-16">
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    {insight.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                    {insight.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Tek rapor
              </p>

              <h2 className="mt-6 text-balance text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-6xl">
                Gerçekten ihtiyaç duyduğunuz her şey.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
                Dağınık bilgileri tek yerde toplar ve kullanıcıya kesin
                satın alma emri vermeden, bilinçli karar almasını destekler.
              </p>
            </div>

            <div className="glass-card rounded-[34px] border border-white/10 p-5 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {analysisItems.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                  >
                    <p className="text-xs font-bold text-emerald-300">
                      0{index + 1}
                    </p>
                    <p className="mt-6 text-lg font-semibold text-white">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-b border-white/5 bg-slate-900/20"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Basit bir deneyim
            </p>

            <h2 className="mt-6 text-balance text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">
              Üç adımda daha bilinçli karar.
            </h2>
          </div>

          <div className="relative mt-16 grid gap-5 lg:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent lg:block" />

            {steps.map((step) => (
              <article
                key={step.number}
                className="glass-card relative rounded-[30px] border border-white/10 p-7 sm:p-8"
              >
                <div className="primary-glow flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-slate-950/60 text-lg font-black text-emerald-300">
                  {step.number}
                </div>

                <h3 className="mt-10 text-2xl font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center sm:py-36">
          <p className="mx-auto max-w-4xl text-balance text-4xl font-black leading-tight tracking-[-0.045em] text-white sm:text-7xl">
            Karar vermeyin.
            <span className="block bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Önce analiz edin.
            </span>
          </p>
        </div>
      </section>

      <section id="analyze" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
                CarVision AI
              </p>
              <h2 className="mt-5 text-balance text-3xl font-black tracking-[-0.035em] text-white sm:text-5xl">
                İlanınızı analiz etmeye başlayın.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Tarayıcı eklentisiyle ilanı aktarın veya bilgileri manuel
                olarak girin.
              </p>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-10 rounded-[44px] bg-gradient-to-r from-emerald-400/10 via-cyan-400/5 to-blue-500/10 blur-3xl" />

              <div className="glass-card relative rounded-[30px] border border-white/10 p-3 shadow-2xl shadow-slate-950/30 sm:rounded-[36px] sm:p-7">
                <div className="mb-6 flex flex-col gap-3 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-emerald-300">
                      Araç Analizi
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                      Bilgileri girin, raporu oluşturun.
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="animate-pulse-soft h-2 w-2 rounded-full bg-emerald-400" />
                    Sistem hazır
                  </div>
                </div>

                <AnalysisForm />
              </div>
            </div>

            <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-slate-500">
              Sonuçlar karar destek ve bilgilendirme amacıyla hazırlanır.
              Nihai satın alma kararı öncesinde bağımsız ekspertiz, tramer,
              servis geçmişi ve resmi kayıtlar doğrulanmalıdır.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}