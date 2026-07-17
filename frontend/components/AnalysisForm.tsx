"use client";

import { FormEvent, useState } from "react";
import AnalysisResultCard from "./AnalysisResult";
import type { AnalysisResult } from "../types/analysis";

export default function AnalysisForm() {
  const [listingUrl, setListingUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedListingUrl = listingUrl.trim();

    if (!trimmedListingUrl) {
      setMessage("Lütfen bir ilan linki gir.");
      setResult(null);
      return;
    }

    setMessage("");
    setResult(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingUrl: trimmedListingUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Analiz başarısız oldu.");
      }

      setResult(data.result as AnalysisResult);
      setMessage("İlan analizi tamamlandı.");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Analiz sırasında bir hata oluştu.";

      setMessage(errorMessage);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-10 w-full max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-4 sm:flex-row"
      >
        <input
          type="url"
          value={listingUrl}
          onChange={(event) => setListingUrl(event.target.value)}
          placeholder="Sahibinden ilan linkini yapıştır..."
          disabled={isLoading}
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-emerald-500 px-8 py-4 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Analiz Ediliyor..." : "Analiz Et"}
        </button>
      </form>

      {isLoading && (
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="font-semibold text-emerald-400">
            İlan analiz ediliyor...
          </p>

          <div className="mt-4 space-y-2 text-sm text-zinc-400">
            <p>İlan bilgileri backend&apos;e gönderiliyor</p>
            <p>Araç verileri hazırlanıyor</p>
            <p>Fiyat analizi oluşturuluyor</p>
            <p>AI raporu hazırlanıyor</p>
          </div>
        </div>
      )}

      {message && !isLoading && (
        <p className="mt-4 text-center text-sm text-zinc-400">{message}</p>
      )}

      {result && <AnalysisResultCard result={result} />}
    </div>
  );
}