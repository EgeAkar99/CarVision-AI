import AnalysisForm from "./AnalysisForm";

const analysisSections = [
  {
    eyebrow: "01 / Piyasa",
    title: "Gerçek piyasa değerini görün.",
    description:
      "İlan fiyatını benzer araçlarla karşılaştırır; aracın piyasanın altında, seviyesinde veya üzerinde olup olmadığını gösterir.",
    metric: "Piyasa konumu",
    detail: "Emsal fiyatlar · medyan · yüzdelik dilim",
  },
  {
    eyebrow: "02 / Risk",
    title: "Sadece fiyatı değil, riski de değerlendirin.",
    description:
      "İlan açıklamasını, araç bilgilerini ve modele özel kronik sorunları birlikte değerlendirerek karar sürecini destekler.",
    metric: "Risk endeksi",
    detail: "Açıklama · kilometre · kronik sorunlar",
  },
  {
    eyebrow: "03 / Maliyet",
    title: "Satın alma sonrasını da hesaba katın.",
    description:
      "Bakım, yakıt, vergi, sigorta, değer kaybı ve olası büyük onarım maliyetlerini tek görünümde toplar.",
    metric: "Sahip olma maliyeti",
    detail: "Yıllık gider · değer kaybı · bakım riski",
  },
];

export default function Hero() {
  return (
    <>
      <section
        id="home"
        className="relative min-h-[92vh] overflow-hidden border-b border-white/[0.06] bg-[#070707]"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a76a]/35 to-transparent" />
          <div className="absolute left-[7%] top-[18%] h-64 w-64 rounded-full bg-[#c7a76a]/[0.055] blur-[120px]" />
          <div className="absolute bottom-[4%] right-[8%] h-80 w-80 rounded-full bg-white/[0.025] blur-[130px]" />
        </div>

        <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-center gap-12 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
          <div className="relative z-10 max-w-2xl">
            <p className="animate-fade-up text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c7a76a] sm:text-xs">
              Profesyonel araç analiz platformu
            </p>

            <h1 className="animate-fade-up-delay-1 mt-7 text-balance text-[46px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#f5f5f3] sm:text-6xl lg:text-[78px]">
              Karar vermeden önce
              <span className="mt-2 block text-[#a7a7a2]">
                gerçeği görün.
              </span>
            </h1>

            <p className="animate-fade-up-delay-2 mt-7 max-w-xl text-base leading-8 text-[#a7a7a2] sm:text-lg">
              Yapay zekâ destekli analiz ile fiyatı, riskleri, uzun vadeli
              maliyetleri ve piyasa konumunu tek raporda değerlendirin.
            </p>

            <div className="animate-fade-up-delay-3 mt-9">
              <a
                href="#analyze"
                className="inline-flex min-w-44 items-center justify-center rounded-full border border-[#c7a76a]/35 bg-[#c7a76a] px-7 py-3.5 text-sm font-semibold text-[#11100d] shadow-[0_16px_55px_rgba(199,167,106,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d3b77e]"
              >
                Analize Başla
              </a>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/[0.07] pt-6 text-xs uppercase tracking-[0.18em] text-[#6f706f]">
              <span>Piyasa</span>
              <span>Risk</span>
              <span>Maliyet</span>
              <span>Pazarlık</span>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[560px]">
            <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/[0.025] via-transparent to-[#c7a76a]/[0.035]" />

            <div className="absolute inset-x-[7%] bottom-[10%] h-[46%] rounded-[46%_46%_20%_20%/65%_65%_24%_24%] bg-gradient-to-b from-[#202124] via-[#111214] to-[#070708] shadow-[0_45px_100px_rgba(0,0,0,0.72)]">
              <div className="absolute left-[7%] right-[7%] top-[18%] h-[42%] rounded-[48%_48%_12%_12%/70%_70%_18%_18%] bg-gradient-to-b from-[#2b2d31] to-[#111215]" />
              <div className="absolute left-[18%] right-[18%] top-[23%] h-[30%] rounded-[48%_48%_18%_18%/72%_72%_20%_20%] bg-gradient-to-b from-[#16181b] to-[#08090a]" />

              <div className="absolute left-[7%] top-[58%] h-[10%] w-[24%] -skew-x-12 rounded-full bg-[#d9c18e]/70 blur-[1px] shadow-[0_0_22px_rgba(217,193,142,0.25)]" />
              <div className="absolute right-[7%] top-[58%] h-[10%] w-[24%] skew-x-12 rounded-full bg-[#d9c18e]/70 blur-[1px] shadow-[0_0_22px_rgba(217,193,142,0.25)]" />

              <div className="absolute left-1/2 top-[55%] h-[16%] w-[14%] -translate-x-1/2 rounded-[50%] border border-white/[0.08] bg-[#0a0b0c]" />
              <div className="absolute inset-x-[12%] bottom-[8%] h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
            </div>

            <div className="absolute bottom-[5%] left-1/2 h-10 w-[72%] -translate-x-1/2 rounded-full bg-black/80 blur-2xl" />

            <div className="absolute right-4 top-8 rounded-full border border-white/[0.08] bg-black/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9e9e99] backdrop-blur-xl">
              CarVision Intelligence
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-[#090909]">
        <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36 lg:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c7a76a]">
            Gerçek veriler
          </p>

          <h2 className="mt-8 max-w-5xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#f5f5f3] sm:text-7xl lg:text-[96px]">
            Tek bir ilandan,
            <span className="block text-[#6f706f]">
              daha net bir karar.
            </span>
          </h2>
        </div>
      </section>

      {analysisSections.map((section, index) => (
        <section
          key={section.eyebrow}
          className={`border-b border-white/[0.06] ${
            index % 2 === 0 ? "bg-[#070707]" : "bg-[#0a0a0a]"
          }`}
        >
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c7a76a]">
                {section.eyebrow}
              </p>

              <h3 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#f5f5f3] sm:text-6xl">
                {section.title}
              </h3>

              <p className="mt-6 max-w-xl text-base leading-8 text-[#999a98]">
                {section.description}
              </p>
            </div>

            <div className="relative min-h-[320px] overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#111214] p-7 shadow-[0_30px_90px_rgba(0,0,0,0.4)] sm:p-10">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a76a]/30 to-transparent" />
              <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#c7a76a]/[0.045] blur-[90px]" />

              <div className="relative flex h-full min-h-[250px] flex-col justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#777873]">
                    {section.metric}
                  </p>

                  <p className="mt-4 max-w-lg text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
                    {section.detail}
                  </p>
                </div>

                <div className="mt-16 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-24 rounded-2xl border border-white/[0.06] bg-white/[0.025]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section id="analyze" className="scroll-mt-24 bg-[#070707]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-8 sm:py-32 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c7a76a]">
                Analize başlayın
              </p>

              <h2 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-[#f5f5f3] sm:text-6xl">
                İlanınızı daha bilinçli değerlendirin.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#969793]">
                Tarayıcı eklentisiyle ilanı aktarın veya araç bilgilerini
                manuel olarak girin.
              </p>
            </div>

            <div className="relative rounded-[34px] border border-white/[0.075] bg-[#101113] p-3 shadow-[0_35px_100px_rgba(0,0,0,0.48)] sm:p-7">
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#c7a76a]/35 to-transparent" />

              <div className="mb-6 flex flex-col gap-3 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#c7a76a]">
                    Araç Analizi
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                    Bilgileri girin, raporu oluşturun.
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#777873]">
                  <span className="h-2 w-2 rounded-full bg-[#c7a76a]" />
                  Sistem hazır
                </div>
              </div>

              <AnalysisForm />
            </div>

            <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-[#666762]">
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