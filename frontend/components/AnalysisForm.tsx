"use client";

import { FormEvent, useEffect, useState } from "react";
import AnalysisResultCard from "./AnalysisResult";
import type { AnalysisResult } from "../types/analysis";
import type {
  BrowserExtensionComparableInput,
  BrowserExtensionVehicleInput,
} from "../types/vehicle";

type AnalysisMode = "listing" | "url" | "manual";

type AnalyzeApiResponse = {
  success: boolean;
  code?: string;
  message?: string;
  result?: AnalysisResult;
};

type ManualFormData = {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  price: string;
  city: string;
  description: string;
};

const initialManualForm: ManualFormData = {
  brand: "",
  model: "",
  year: "",
  mileage: "",
  fuel: "",
  transmission: "",
  price: "",
  city: "",
  description: "",
};

export default function AnalysisForm() {
  const [mode, setMode] = useState<AnalysisMode>("listing");
  const [listingUrl, setListingUrl] = useState("");
  const [manualForm, setManualForm] =
    useState<ManualFormData>(initialManualForm);
  const [message, setMessage] = useState("");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [browserVehicle, setBrowserVehicle] =
    useState<BrowserExtensionVehicleInput | null>(null);
  const [browserComparables, setBrowserComparables] =
    useState<BrowserExtensionComparableInput[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transferToken = params.get("extensionToken");

    if (!transferToken) {
      return;
    }

    const token = transferToken;

    async function loadExtensionTransfer() {
      try {
        const response = await fetch(
          `/api/extension-transfer?token=${encodeURIComponent(
            token
          )}`
        );

        const payload = (await response.json()) as {
          success?: boolean;
          message?: string;
          vehicle?: BrowserExtensionVehicleInput;
          comparables?: BrowserExtensionComparableInput[];
        };

        if (!response.ok || !payload.success || !payload.vehicle) {
          throw new Error(
            payload.message ||
              "Eklentiden gelen araç verisi alınamadı."
          );
        }

        const vehicle = payload.vehicle;
        const comparables = Array.isArray(payload.comparables)
          ? payload.comparables
          : [];

        setBrowserVehicle(vehicle);
        setBrowserComparables(comparables);
        setListingUrl(vehicle.url?.trim() ?? "");
        setMode("listing");
        setMessage(
          `Eklentiden araç bilgileri ve ${comparables.length} emsal alındı.`
        );
        setErrorCode(null);
        setResult(null);

        window.history.replaceState(
          {},
          "",
          window.location.pathname
        );
      } catch (error) {
        setBrowserVehicle(null);
        setBrowserComparables([]);
        setMessage(
          error instanceof Error
            ? error.message
            : "Eklentiden gelen araç bilgileri okunamadı."
        );
        setErrorCode("EXTENSION_DATA_ERROR");
      }
    }

    void loadExtensionTransfer();
  }, []);

  function resetFeedback() {
    setMessage("");
    setErrorCode(null);
    setResult(null);
  }

  function changeMode(nextMode: AnalysisMode) {
    setMode(nextMode);
    resetFeedback();
  }

  function updateManualField(
    field: keyof ManualFormData,
    value: string
  ) {
    setManualForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    resetFeedback();

    let requestBody;

    if (mode === "manual") {
      const requiredFields = [
        manualForm.brand,
        manualForm.model,
        manualForm.year,
        manualForm.mileage,
        manualForm.fuel,
        manualForm.transmission,
        manualForm.price,
        manualForm.city,
      ];

      if (requiredFields.some((field) => !field.trim())) {
        setMessage("Lütfen zorunlu araç bilgilerini eksiksiz doldur.");
        setErrorCode("VALIDATION_ERROR");
        return;
      }

      const year = Number(manualForm.year);
      const mileage = Number(manualForm.mileage);
      const price = Number(manualForm.price);
      const currentYear = new Date().getFullYear();

      if (
        !Number.isFinite(year) ||
        year < 1950 ||
        year > currentYear + 1
      ) {
        setMessage("Geçerli bir model yılı gir.");
        setErrorCode("VALIDATION_ERROR");
        return;
      }

      if (!Number.isFinite(mileage) || mileage < 0) {
        setMessage("Geçerli bir kilometre değeri gir.");
        setErrorCode("VALIDATION_ERROR");
        return;
      }

      if (!Number.isFinite(price) || price <= 0) {
        setMessage("Geçerli bir ilan fiyatı gir.");
        setErrorCode("VALIDATION_ERROR");
        return;
      }
    }

    if (mode === "listing") {
      if (!browserVehicle) {
        setMessage(
          "İlanı analiz etmek için Sahibinden sayfasında CarVision AI uzantısından Aktar butonunu kullan."
        );
        setErrorCode("EXTENSION_REQUIRED");
        return;
      }

      requestBody = {
        source: "browser-extension",
        vehicle: browserVehicle,
        comparables: browserComparables,
      };
    } else if (mode === "url") {
      const normalizedListingUrl = listingUrl.trim();

      if (!normalizedListingUrl) {
        setMessage("Lütfen Sahibinden ilan bağlantısını gir.");
        setErrorCode("VALIDATION_ERROR");
        return;
      }

      try {
        const parsedUrl = new URL(normalizedListingUrl);
        const hostname = parsedUrl.hostname.toLowerCase();

        if (
          hostname !== "sahibinden.com" &&
          !hostname.endsWith(".sahibinden.com")
        ) {
          throw new Error();
        }
      } catch {
        setMessage("Geçerli bir Sahibinden ilan bağlantısı gir.");
        setErrorCode("VALIDATION_ERROR");
        return;
      }

      requestBody = {
        source: "listing",
        listingUrl: normalizedListingUrl,
      };
    } else {
      requestBody = {
        source: "manual",
        listingUrl: listingUrl.trim() || undefined,
        vehicle: {
          brand: manualForm.brand.trim(),
          model: manualForm.model.trim(),
          year: Number(manualForm.year),
          mileage: Number(manualForm.mileage),
          fuel: manualForm.fuel.trim(),
          transmission: manualForm.transmission.trim(),
          price: Number(manualForm.price),
          city: manualForm.city.trim(),
          description: manualForm.description.trim() || undefined,
        },
      };
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = (await response.json()) as AnalyzeApiResponse;

      if (!response.ok || !data.success || !data.result) {
        setErrorCode(data.code ?? "ANALYSIS_FAILED");
        throw new Error(data.message || "Analiz başarısız oldu.");
      }

      setResult(data.result);
      setMessage("Araç analizi tamamlandı.");

      window.setTimeout(() => {
        document
          .getElementById("analysis-result")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
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
    <div className="mx-auto mt-10 w-full max-w-4xl">
      <div className="glass-card mb-5 grid grid-cols-3 rounded-2xl p-1.5 shadow-2xl shadow-slate-950/20">
        <button
          type="button"
          onClick={() => changeMode("listing")}
          className={`rounded-xl px-3 py-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${
            mode === "listing"
              ? "primary-glow bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Uzantı ile Aktar
        </button>

        <button
          type="button"
          onClick={() => changeMode("url")}
          className={`rounded-xl px-2 py-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${
            mode === "url"
              ? "primary-glow bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950"
              : "text-slate-300 hover:text-white"
          }`}
        >
          URL ile Analiz
        </button>

        <button
          type="button"
          onClick={() => changeMode("manual")}
          className={`rounded-xl px-2 py-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${
            mode === "manual"
              ? "primary-glow bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Manuel Araç Bilgisi
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "listing" ? (
          <div className="glass-card rounded-3xl p-5 sm:p-6">
            {browserVehicle ? (
              <>
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                  <p className="text-sm font-semibold text-emerald-300">
                    İlan uzantıdan başarıyla aktarıldı
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {browserVehicle.title ||
                      `${browserVehicle.brand} ${browserVehicle.model}`}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {browserComparables.length} gerçek emsal alındı.
                  </p>

                  {listingUrl && (
                    <p className="mt-3 truncate text-xs text-slate-500">
                      {listingUrl}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="primary-glow mt-4 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-4 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:from-emerald-300 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Analiz Ediliyor..." : "Aktarılan İlanı Analiz Et"}
                </button>
              </>
            ) : (
              <div className="rounded-2xl border border-slate-500/30 bg-slate-950/35 p-5 text-left">
                <p className="font-semibold text-white">
                  İlan linkini buraya yapıştırmana gerek yok
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Sahibinden ilanını aç, CarVision AI uzantısına tıkla ve
                  <span className="font-semibold text-emerald-300">
                    {" "}Aktar
                  </span>
                  {" "}butonunu kullan. Araç bilgileri ve gerçek emsaller
                  otomatik olarak bu ekrana gelecektir.
                </p>

                <div className="mt-4 grid gap-2 text-sm text-slate-400 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    1. İlanı aç
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    2. Uzantıya tıkla
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    3. Aktar butonuna bas
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => changeMode("manual")}
                  className="mt-5 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                >
                  Uzantı kullanmadan manuel giriş yap
                </button>
              </div>
            )}
          </div>
        ) : mode === "url" ? (
          <div className="glass-card rounded-3xl p-5 sm:p-6">
            <div className="rounded-2xl border border-slate-500/30 bg-slate-950/35 p-5">
              <p className="font-semibold text-white">
                Sahibinden ilan bağlantısını yapıştır
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                İlan bilgileri bağlantı üzerinden okunarak mevcut CarVision AI
                analiz raporu hazırlanacaktır.
              </p>

              <label
                htmlFor="listing-url"
                className="mt-5 block text-sm font-medium text-slate-200"
              >
                İlan URL&apos;si
              </label>

              <input
                id="listing-url"
                type="url"
                value={listingUrl}
                onChange={(event) => setListingUrl(event.target.value)}
                placeholder="https://www.sahibinden.com/ilan/..."
                disabled={isLoading}
                className="mt-2 w-full rounded-xl border border-slate-500/35 bg-slate-950/45 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="primary-glow mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-4 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:from-emerald-300 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Analiz Ediliyor..." : "URL ile İlanı Analiz Et"}
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="Marka"
                value={manualForm.brand}
                placeholder="BMW"
                onChange={(value) => updateManualField("brand", value)}
              />

              <FormInput
                label="Model"
                value={manualForm.model}
                placeholder="320i ED"
                onChange={(value) => updateManualField("model", value)}
              />

              <FormInput
                label="Model Yılı"
                type="number"
                value={manualForm.year}
                placeholder="2018"
                onChange={(value) => updateManualField("year", value)}
              />

              <FormInput
                label="Kilometre"
                type="number"
                value={manualForm.mileage}
                placeholder="120000"
                onChange={(value) => updateManualField("mileage", value)}
              />

              <FormInput
                label="Yakıt"
                value={manualForm.fuel}
                placeholder="Benzin"
                onChange={(value) => updateManualField("fuel", value)}
              />

              <FormInput
                label="Vites"
                value={manualForm.transmission}
                placeholder="Otomatik"
                onChange={(value) =>
                  updateManualField("transmission", value)
                }
              />

              <FormInput
                label="İlan Fiyatı"
                type="number"
                value={manualForm.price}
                placeholder="1250000"
                onChange={(value) => updateManualField("price", value)}
              />

              <FormInput
                label="Şehir"
                value={manualForm.city}
                placeholder="Ankara"
                onChange={(value) => updateManualField("city", value)}
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-slate-200">
                İlan Açıklaması
              </label>

              <textarea
                value={manualForm.description}
                onChange={(event) =>
                  updateManualField("description", event.target.value)
                }
                placeholder="Bakım, hasar, değişen, boya ve diğer araç bilgileri..."
                rows={5}
                disabled={isLoading}
                className="mt-2 w-full resize-none rounded-xl border border-slate-500/35 bg-slate-950/45 px-4 py-3 text-white outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="primary-glow mt-5 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-8 py-4 font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:from-emerald-300 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Analiz Ediliyor..." : "Araç Bilgilerini Analiz Et"}
            </button>
          </div>
        )}
      </form>

      {isLoading && (
        <div className="glass-card mt-6 overflow-hidden rounded-3xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-emerald-300">
                Araç analiz ediliyor
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Veriler işleniyor ve rapor hazırlanıyor.
              </p>
            </div>

            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600/40 border-t-emerald-400" />
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700/50">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              "Araç bilgileri doğrulanıyor",
              "Emsal piyasa verileri inceleniyor",
              "Riskler hesaplanıyor",
              "AI raporu hazırlanıyor",
            ].map((step) => (
              <div
                key={step}
                className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300"
              >
                <span className="animate-pulse-soft h-2 w-2 rounded-full bg-emerald-400" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {message && !isLoading && (
          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-center text-sm ${
              errorCode === "EXTENSION_REQUIRED"
                ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
                : errorCode
                  ? "border-rose-400/20 bg-rose-400/10 text-rose-200"
                  : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
            }`}
          >
            {message}
          </div>
      )}

      {result && (
        <div id="analysis-result" className="scroll-mt-6">
          <AnalysisResultCard result={result} />
        </div>
      )}
    </div>
  );
}

type FormInputProps = {
  label: string;
  value: string;
  placeholder: string;
  type?: "text" | "number";
  onChange: (value: string) => void;
};

function FormInput({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: FormInputProps) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-200">{label}</span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={false}
        required
        min={type === "number" ? 0 : undefined}
        className="mt-2 w-full rounded-xl border border-slate-500/35 bg-slate-950/45 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}