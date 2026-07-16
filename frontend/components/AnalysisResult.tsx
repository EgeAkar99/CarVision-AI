type AnalysisResultProps = {
  title: string;
  year: number;
  listingPrice: string;
  marketPrice: string;
  score: number;
};

export default function AnalysisResult({
  title,
  year,
  listingPrice,
  marketPrice,
  score,
}: AnalysisResultProps) {
  return (
    <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">AI Analiz Sonucu</p>

          <h2 className="mt-1 text-2xl font-bold">
            {year} {title}
          </h2>
        </div>

        <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400">
          Satın Alınabilir
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-black p-4">
          <p className="text-sm text-zinc-500">İlan Fiyatı</p>
          <h3 className="mt-2 text-xl font-bold">{listingPrice}</h3>
        </div>

        <div className="rounded-xl bg-black p-4">
          <p className="text-sm text-zinc-500">Piyasa Değeri</p>
          <h3 className="mt-2 text-xl font-bold text-emerald-400">
            {marketPrice}
          </h3>
        </div>

        <div className="rounded-xl bg-black p-4">
          <p className="text-sm text-zinc-500">AI Güven Puanı</p>
          <h3 className="mt-2 text-xl font-bold">{score} / 100</h3>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">
          Dikkat Edilmesi Gerekenler
        </h3>

        <ul className="mt-3 space-y-2 text-zinc-400">
          <li>• Tramer kaydı ekspertiz ile doğrulanmalı.</li>
          <li>• Bakım geçmişi satıcıdan istenmeli.</li>
          <li>• Motor ve şanzıman kontrol edilmeli.</li>
        </ul>
      </div>
    </div>
  );
}