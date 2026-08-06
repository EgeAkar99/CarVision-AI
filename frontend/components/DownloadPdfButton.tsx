"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { AnalysisResult } from "@/types/analysis";

type DownloadPdfButtonProps = {
  result: AnalysisResult;
};

const recommendationLabels = {
  strong_buy: "Güçlü Alım Fırsatı",
  buy: "Satın Alınabilir",
  consider: "Dikkatli Değerlendir",
  avoid: "Uzak Dur",
} as const;

const priceLabels = {
  very_good: "Çok Avantajlı",
  good: "Avantajlı",
  fair: "Piyasa Değerinde",
  expensive: "Pahalı",
  very_expensive: "Çok Pahalı",
} as const;

const riskLabels = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
  very_high: "Çok Yüksek",
} as const;

function normalizeText(value: string) {
  return value
    .replace(/Ğ/g, "G")
    .replace(/ğ/g, "g")
    .replace(/Ü/g, "U")
    .replace(/ü/g, "u")
    .replace(/Ş/g, "S")
    .replace(/ş/g, "s")
    .replace(/İ/g, "I")
    .replace(/ı/g, "i")
    .replace(/Ö/g, "O")
    .replace(/ö/g, "o")
    .replace(/Ç/g, "C")
    .replace(/ç/g, "c");
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value);
}

type PdfWithTable = jsPDF & {
  lastAutoTable?: {
    finalY: number;
  };
};

export default function DownloadPdfButton({
  result,
}: DownloadPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  function getFinalY(doc: jsPDF, fallback: number) {
    return (doc as PdfWithTable).lastAutoTable?.finalY ?? fallback;
  }

  function addTitle(doc: jsPDF, title: string, y: number) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(normalizeText(title), 14, y);
    doc.setDrawColor(16, 185, 129);
    doc.line(14, y + 2, 196, y + 2);

    return y + 8;
  }

  function ensureSpace(
    doc: jsPDF,
    y: number,
    requiredSpace = 35,
  ) {
    if (y + requiredSpace > 280) {
      doc.addPage();
      return 18;
    }

    return y;
  }

  function addParagraph(doc: jsPDF, text: string, y: number) {
    const normalized = normalizeText(text);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    const lines = doc.splitTextToSize(normalized, 182);

    doc.text(lines, 14, y);

    return y + lines.length * 4.5 + 4;
  }

  function addList(
    doc: jsPDF,
    title: string,
    items: string[],
    startY: number,
  ) {
    if (items.length === 0) {
      return startY;
    }

    let y = ensureSpace(doc, startY);
    y = addTitle(doc, title, y);

    for (const item of items) {
      y = ensureSpace(doc, y, 12);
      y = addParagraph(doc, `- ${item}`, y);
    }

    return y;
  }

  function createPdf() {
    try {
      setIsGenerating(true);

      const {
        vehicle,
        score,
        analysisConfidence,
        purchaseRecommendation,
        priceAnalysis,
        marketAnalysis,
        ownershipCostAnalysis,
        lifetimeAnalysis,
        purchaseRiskAnalysis,
        competitivePositioning,
        negotiationAnalysis,
        descriptionAnalysis,
        chronicProblems,
        advantages,
        disadvantages,
        aiComment,
        negotiationAdvice,
        importantChecks,
      } = result;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      doc.setProperties({
        title: `${vehicle.brand} ${vehicle.model} CarVision AI Raporu`,
        subject: "Araç analiz raporu",
        author: "CarVision AI",
        creator: "CarVision AI",
      });

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 42, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("CarVision AI", 14, 17);

      doc.setFontSize(14);
      doc.text(
        normalizeText(
          `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
        ),
        14,
        27,
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text(
        normalizeText(
          `Rapor tarihi: ${new Intl.DateTimeFormat("tr-TR", {
            dateStyle: "long",
            timeStyle: "short",
          }).format(new Date())}`,
        ),
        14,
        35,
      );

      autoTable(doc, {
        startY: 49,
        theme: "grid",
        head: [
          [
            "Genel Puan",
            "Analiz Guveni",
            "Satin Alma Onerisi",
          ],
        ],
        body: [
          [
            `${score}/100`,
            `%${analysisConfidence}`,
            normalizeText(
              recommendationLabels[purchaseRecommendation],
            ),
          ],
        ],
        styles: {
          font: "helvetica",
          fontSize: 10,
          halign: "center",
          cellPadding: 4,
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
        },
      });

      let y = getFinalY(doc, 70) + 10;
      y = addTitle(doc, "Arac Bilgileri", y);

      const location = [
        vehicle.city,
        vehicle.district,
        vehicle.neighborhood,
      ]
        .filter(Boolean)
        .join(" / ");

      autoTable(doc, {
        startY: y,
        theme: "striped",
        body: [
          ["Marka", normalizeText(vehicle.brand)],
          ["Model", normalizeText(vehicle.model)],
          ["Seri", normalizeText(vehicle.series ?? "-")],
          ["Yil", String(vehicle.year)],
          [
            "Kilometre",
            `${formatNumber(vehicle.mileage)} km`,
          ],
          ["Yakit", normalizeText(vehicle.fuel)],
          ["Vites", normalizeText(vehicle.transmission)],
          ["Fiyat", normalizeText(formatPrice(vehicle.price))],
          [
            "Konum",
            normalizeText(location || vehicle.city || "-"),
          ],
          [
            "Kasa Tipi",
            normalizeText(vehicle.bodyType ?? "-"),
          ],
          [
            "Motor Gucu",
            normalizeText(vehicle.enginePower ?? "-"),
          ],
          [
            "Motor Hacmi",
            normalizeText(vehicle.engineVolume ?? "-"),
          ],
          ["Cekis", normalizeText(vehicle.traction ?? "-")],
          ["Renk", normalizeText(vehicle.color ?? "-")],
          [
            "Ilan No",
            normalizeText(vehicle.listingNumber ?? "-"),
          ],
        ],
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 2.7,
        },
        columnStyles: {
          0: {
            fontStyle: "bold",
            cellWidth: 48,
          },
        },
      });

      y = getFinalY(doc, y) + 10;
      y = ensureSpace(doc, y, 60);
      y = addTitle(doc, "Fiyat Analizi", y);

      autoTable(doc, {
        startY: y,
        theme: "grid",
        body: [
          [
            "Ilan Fiyati",
            normalizeText(
              formatPrice(priceAnalysis.listingPrice),
            ),
          ],
          [
            "Tahmini Piyasa Degeri",
            normalizeText(
              formatPrice(
                priceAnalysis.estimatedMarketPrice,
              ),
            ),
          ],
          [
            "Fiyat Farki",
            normalizeText(formatPrice(priceAnalysis.difference)),
          ],
          [
            "Fark Orani",
            `%${priceAnalysis.differencePercentage.toFixed(1)}`,
          ],
          [
            "Degerlendirme",
            normalizeText(
              priceLabels[priceAnalysis.evaluation],
            ),
          ],
        ],
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: {
            fontStyle: "bold",
            cellWidth: 65,
          },
        },
      });

      y = getFinalY(doc, y) + 10;
      y = ensureSpace(doc, y, 75);
      y = addTitle(doc, "Piyasa Analizi", y);

      autoTable(doc, {
        startY: y,
        theme: "grid",
        body: [
          [
            "Emsal Sayisi",
            String(marketAnalysis.comparableCount),
          ],
          [
            "En Dusuk Fiyat",
            normalizeText(
              formatPrice(marketAnalysis.lowestPrice),
            ),
          ],
          [
            "En Yuksek Fiyat",
            normalizeText(
              formatPrice(marketAnalysis.highestPrice),
            ),
          ],
          [
            "Ortalama Fiyat",
            normalizeText(
              formatPrice(marketAnalysis.averagePrice),
            ),
          ],
          [
            "Medyan Fiyat",
            normalizeText(
              formatPrice(marketAnalysis.medianPrice),
            ),
          ],
          [
            "Piyasa Guveni",
            `%${marketAnalysis.confidence}`,
          ],
          [
            "Fiyat Sirasi",
            `${competitivePositioning.priceRank}/${competitivePositioning.totalComparableCount}`,
          ],
          [
            "Ucuz Oldugu Oran",
            `%${competitivePositioning.cheaperThanPercentage}`,
          ],
          [
            "Fiyat Avantaj Puani",
            `${competitivePositioning.priceAdvantageScore}/100`,
          ],
        ],
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: {
            fontStyle: "bold",
            cellWidth: 65,
          },
        },
      });

      y = getFinalY(doc, y) + 6;
      y = addParagraph(
        doc,
        competitivePositioning.summary,
        y,
      );

      y = ensureSpace(doc, y, 85);
      y = addTitle(doc, "Maliyet ve Omur Analizi", y);

      autoTable(doc, {
        startY: y,
        theme: "striped",
        body: [
          [
            "Yillik Bakim",
            normalizeText(
              formatPrice(
                ownershipCostAnalysis.annualMaintenanceCost,
              ),
            ),
          ],
          [
            "Yillik Yakit",
            normalizeText(
              formatPrice(
                ownershipCostAnalysis.annualFuelCost,
              ),
            ),
          ],
          [
            "Yillik Vergi",
            normalizeText(
              formatPrice(
                ownershipCostAnalysis.annualTaxEstimate,
              ),
            ),
          ],
          [
            "Yillik Sigorta",
            normalizeText(
              formatPrice(
                ownershipCostAnalysis.annualInsuranceEstimate,
              ),
            ),
          ],
          [
            "Yillik Toplam",
            normalizeText(
              formatPrice(
                ownershipCostAnalysis.annualTotalCost,
              ),
            ),
          ],
          [
            "Buyuk Onarim Riski",
            normalizeText(
              formatPrice(
                ownershipCostAnalysis.potentialMajorRepairCost,
              ),
            ),
          ],
          [
            "3 Yillik Deger Kaybi",
            normalizeText(
              formatPrice(
                ownershipCostAnalysis.threeYearDepreciation,
              ),
            ),
          ],
          [
            "Motor Kalan Omur",
            `${formatNumber(
              lifetimeAnalysis.remainingEngineLifeKm,
            )} km`,
          ],
          [
            "Sanziman Kalan Omur",
            `${formatNumber(
              lifetimeAnalysis.remainingTransmissionLifeKm,
            )} km`,
          ],
          [
            "Omur Puani",
            `${lifetimeAnalysis.overallLifetimeScore}/100`,
          ],
          [
            "Kritik Ariza Olasiligi",
            `%${lifetimeAnalysis.criticalRepairProbability}`,
          ],
        ],
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 2.7,
        },
        columnStyles: {
          0: {
            fontStyle: "bold",
            cellWidth: 65,
          },
        },
      });

      y = getFinalY(doc, y) + 10;
      y = ensureSpace(doc, y, 45);
      y = addTitle(doc, "Risk Analizi", y);

      y = addParagraph(
        doc,
        `Risk puani: ${purchaseRiskAnalysis.riskScore}/100\nRisk seviyesi: ${
          riskLabels[purchaseRiskAnalysis.riskLevel]
        }\n${purchaseRiskAnalysis.summary}`,
        y,
      );

      y = ensureSpace(doc, y, 40);
      y = addTitle(doc, "Aciklama Analizi", y);

      y = addParagraph(
        doc,
        `Risk puani: ${descriptionAnalysis.riskScore}/100\n${descriptionAnalysis.summary}`,
        y,
      );

      y = addList(doc, "Avantajlar", advantages, y);
      y = addList(doc, "Dezavantajlar", disadvantages, y);
      y = addList(
        doc,
        "Kronik Problemler",
        chronicProblems,
        y,
      );
      y = addList(
        doc,
        "Kontrol Edilmesi Gerekenler",
        importantChecks,
        y,
      );

      y = ensureSpace(doc, y, 45);
      y = addTitle(doc, "AI Yorumu", y);
      y = addParagraph(doc, aiComment, y);

      y = ensureSpace(doc, y, 70);
      y = addTitle(doc, "Pazarlik Plani", y);

      autoTable(doc, {
        startY: y,
        theme: "grid",
        body: [
          [
            "Onerilen Teklif",
            normalizeText(
              formatPrice(
                negotiationAnalysis.suggestedOfferPrice,
              ),
            ),
          ],
          [
            "Hedef Alim Fiyati",
            normalizeText(
              formatPrice(
                negotiationAnalysis.targetPurchasePrice,
              ),
            ),
          ],
          [
            "Maksimum Alim Fiyati",
            normalizeText(
              formatPrice(
                negotiationAnalysis.maximumPurchasePrice,
              ),
            ),
          ],
          [
            "Pazarlik Payi",
            normalizeText(
              formatPrice(
                negotiationAnalysis.negotiationMargin,
              ),
            ),
          ],
          [
            "Pazarlik Gucu",
            `${negotiationAnalysis.negotiationPower}/100`,
          ],
        ],
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: {
            fontStyle: "bold",
            cellWidth: 65,
          },
        },
      });

      y = getFinalY(doc, y) + 7;
      y = addParagraph(
        doc,
        negotiationAnalysis.strategy,
        y,
      );

      y = addList(
        doc,
        "Pazarlik Argumanlari",
        negotiationAnalysis.arguments,
        y,
      );

      y = ensureSpace(doc, y, 40);
      y = addTitle(doc, "Pazarlik Tavsiyesi", y);
      addParagraph(doc, negotiationAdvice, y);

      const pageCount = doc.getNumberOfPages();

      for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `CarVision AI - Sayfa ${page}/${pageCount}`,
          14,
          290,
        );
      }

      const fileName =
        `${vehicle.year}-${normalizeText(vehicle.brand)}-${normalizeText(
          vehicle.model,
        )}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "carvision-ai";

      doc.save(`${fileName}-raporu.pdf`);
    } catch (error) {
      console.error("PDF oluşturma hatası:", error);

      window.alert(
        "PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={createPdf}
      disabled={isGenerating}
      className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:border-emerald-400 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isGenerating ? "PDF Hazırlanıyor..." : "PDF İndir"}
    </button>
  );
}