"use client";

import { FormEvent, useEffect, useState } from "react";
import AnalysisResultCard from "./AnalysisResult";
import type { AnalysisResult } from "../types/analysis";
import type {
  BrowserExtensionComparableInput,
  BrowserExtensionVehicleInput,
} from "../types/vehicle";

type AnalysisMode = "listing" | "manual";

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
      <div className="mb-5 grid grid-cols-2 rounded-2xl border border-white/[0.08] bg-[#111214] p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
        <button
          type="button"
          onClick={() => changeMode("listing")}
          className={`rounded-xl px-3 py-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${
            mode === "listing"
              ? "border border-[#c8a96a]/35 bg-gradient-to-r from-[#c8a96a] to-[#b9985a] text-[#11100d] shadow-[0_12px_40px_rgba(200,169,106,0.16)]"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Uzantı ile Aktar
        </button>

        <button
          type="button"
          onClick={() => changeMode("manual")}
          className={`rounded-xl px-3 py-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${
            mode === "manual"
              ? "border border-[#c8a96a]/35 bg-gradient-to-r from-[#c8a96a] to-[#b9985a] text-[#11100d] shadow-[0_12px_40px_rgba(200,169,106,0.16)]"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Manuel Araç Bilgisi
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "listing" ? (
          <div className="rounded-3xl border border-white/[0.08] bg-[#101113] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6">
            {browserVehicle ? (
              <>
                <div className="rounded-2xl border border-[#c8a96a]/20 bg-[#c8a96a]/[0.06] p-4">
                  <p className="text-sm font-semibold text-[#d6b77b]">
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
                  className="mt-4 w-full rounded-2xl border border-[#c8a96a]/35 bg-gradient-to-r from-[#c8a96a] to-[#b9985a] px-6 py-4 font-semibold text-[#11100d] shadow-[0_14px_45px_rgba(200,169,106,0.14)] transition hover:-translate-y-0.5 hover:from-[#d6b77b] hover:to-[#c8a96a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Analiz Ediliyor..." : "Aktarılan İlanı Analiz Et"}
                </button>
              </>
            ) : (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0d0e10] p-5 text-left">
                <p className="font-semibold text-white">
                  İlan linkini buraya yapıştırmana gerek yok
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Sahibinden ilanını aç, CarVision AI uzantısına tıkla ve
                  <span className="font-semibold text-[#d6b77b]">
                    {" "}Aktar
                  </span>
                  {" "}butonunu kullan. Araç bilgileri ve gerçek emsaller
                  otomatik olarak bu ekrana gelecektir.
                </p>

                <div className="mt-4 grid gap-2 text-sm text-slate-400 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                    1. İlanı aç
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                    2. Uzantıya tıkla
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                    3. Aktar butonuna bas
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => changeMode("manual")}
                  className="mt-5 text-sm font-semibold text-[#d6b77b] transition hover:text-emerald-200"
                >
                  Uzantı kullanmadan manuel giriş yap
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/[0.08] bg-[#101113] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
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
                className="mt-2 w-full resize-none rounded-xl border border-slate-500/35 bg-slate-950/45 px-4 py-3 text-white outline-none transition focus:border-[#c8a96a]/60 focus:ring-1 focus:ring-[#c8a96a]/15 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-5 w-full rounded-2xl border border-[#c8a96a]/35 bg-gradient-to-r from-[#c8a96a] to-[#b9985a] px-8 py-4 font-semibold text-[#11100d] shadow-[0_14px_45px_rgba(200,169,106,0.14)] transition hover:-translate-y-0.5 hover:from-[#d6b77b] hover:to-[#c8a96a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Analiz Ediliyor..." : "Araç Bilgilerini Analiz Et"}
            </button>
          </div>
        )}
      </form>

      {isLoading && (
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#101113] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#d6b77b]">
                Araç analiz ediliyor
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Veriler işleniyor ve rapor hazırlanıyor.
              </p>
            </div>

            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-[#c8a96a]" />
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700/50">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-[#b9985a] via-[#d6b77b] to-[#f0d59b]" />
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
                className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm text-[#b5b5b0]"
              >
                <span className="animate-pulse-soft h-2 w-2 rounded-full bg-[#c8a96a]" />
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
                  : "border-emerald-400/20 bg-[#c8a96a]/10 text-emerald-200"
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
        className="mt-2 w-full rounded-xl border border-slate-500/35 bg-slate-950/45 px-4 py-3 text-white outline-none transition focus:border-[#c8a96a]/60 focus:ring-1 focus:ring-[#c8a96a]/15"
      />
    </label>
  );
}