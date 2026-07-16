import AnalysisForm from "./AnalysisForm";

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">
        CarVision <span className="text-emerald-500">AI</span>
      </h1>

      <p className="mt-6 max-w-2xl text-center text-zinc-400">
        Sahibinden araç ilanlarını yapay zekâ ile analiz edin. Emsal ilanları
        karşılaştırın, fiyat değerlendirmesi alın, kronik sorunları öğrenin ve
        güvenle karar verin.
      </p>

      <AnalysisForm />
    </section>
  );
}