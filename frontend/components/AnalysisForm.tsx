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
        setMessage("Eklentiden araç bilgileri alındı.");
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

    if (mode === "listing") {
      if (browserVehicle) {
        requestBody = {
          source: "browser-extension",
          vehicle: browserVehicle,
          comparables: browserComparables,
        };
      } else {
        const trimmedListingUrl = listingUrl.trim();

        if (!trimmedListingUrl) {
          setMessage("Lütfen bir ilan linki gir.");
          setErrorCode("VALIDATION_ERROR");
          return;
        }

        requestBody = {
          source: "listing",
          listingUrl: trimmedListingUrl,
        };
      }
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
    <div className="mt-10 w-full max-w-4xl">
      <div className="mb-6 grid grid-cols-2 rounded-xl border border-zinc-800 bg-zinc-900 p-1">
        <button
          type="button"
          onClick={() => changeMode("listing")}
          className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
            mode === "listing"
              ? "bg-emerald-500 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          İlan Linki
        </button>

        <button
          type="button"
          onClick={() => changeMode("manual")}
          className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
            mode === "manual"
              ? "bg-emerald-500 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Manuel Araç Bilgisi
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === "listing" ? (
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <input
              type="url"
              value={listingUrl}
              onChange={(event) => {
                setListingUrl(event.target.value);
                setBrowserVehicle(null);
                setBrowserComparables([]);
              }}
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
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
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
              <label className="text-sm font-medium text-zinc-300">
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
                className="mt-2 w-full resize-none rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-5 w-full rounded-xl bg-emerald-500 px-8 py-4 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Analiz Ediliyor..." : "Araç Bilgilerini Analiz Et"}
            </button>
          </div>
        )}
      </form>

      {isLoading && (
        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="font-semibold text-emerald-400">
            Araç analiz ediliyor...
          </p>

          <div className="mt-4 space-y-2 text-sm text-zinc-400">
            <p>Araç bilgileri backend&apos;e gönderiliyor</p>
            <p>Fiyat analizi oluşturuluyor</p>
            <p>Riskler değerlendiriliyor</p>
            <p>AI raporu hazırlanıyor</p>
          </div>
        </div>
      )}

      {message && !isLoading && errorCode === "ACCESS_BLOCKED" && (
        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
          <p className="font-semibold text-amber-400">
            İlan bilgilerine doğrudan erişilemedi
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-300">
            Sahibinden, sunucu üzerinden yapılan otomatik isteği engelledi.
            Araç bilgilerini manuel girerek analize devam edebilirsin.
          </p>

          <button
            type="button"
            onClick={() => changeMode("manual")}
            className="mt-4 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
          >
            Manuel Girişe Geç
          </button>
        </div>
      )}

      {message &&
        !isLoading &&
        errorCode !== "ACCESS_BLOCKED" && (
          <p className="mt-4 text-center text-sm text-zinc-400">
            {message}
          </p>
        )}

      {result && <AnalysisResultCard result={result} />}
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
      <span className="text-sm font-medium text-zinc-300">{label}</span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}