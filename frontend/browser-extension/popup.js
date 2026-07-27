const button = document.getElementById("send");
const status = document.getElementById("status");

const APP_URL = "http://localhost:3000";

function isSahibindenUrl(url) {
  return (
    url.startsWith("https://www.sahibinden.com/") ||
    url.startsWith("https://sahibinden.com/") ||
    url.includes(".sahibinden.com/")
  );
}

async function getPageData(tabId) {
  try {
    return await chrome.tabs.sendMessage(tabId, {
      type: "CARVISION_GET_PAGE_DATA",
    });
  } catch {
    throw new Error(
      "Sayfa verileri okunamadı. Sahibinden sayfasını yenileyip tekrar deneyin."
    );
  }
}

async function findComparables(vehicle) {
  try {
    const response = await chrome.runtime.sendMessage({
      type: "CARVISION_FIND_COMPARABLES",
      vehicle,
    });

    return response?.success && Array.isArray(response.comparables)
      ? response.comparables
      : [];
  } catch {
    return [];
  }
}

button.addEventListener("click", async () => {
  status.textContent = "Araç ve emsal bilgileri okunuyor...";
  button.disabled = true;

  try {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!activeTab?.id || !activeTab.url) {
      throw new Error("Aktif sekme bulunamadı.");
    }

    if (!isSahibindenUrl(activeTab.url)) {
      throw new Error(
        "Eklentiyi açık bir Sahibinden araç ilanı sekmesinde çalıştırın."
      );
    }

    const pageData = await getPageData(activeTab.id);
    const vehicle = pageData?.vehicle;

    if (!vehicle?.brand || !vehicle?.model || !vehicle?.price) {
      throw new Error(
        "Araç bilgileri eksik okundu. Sayfayı yenileyip tekrar deneyin."
      );
    }

    let comparables = Array.isArray(pageData?.comparables)
      ? pageData.comparables
      : [];

    if (!comparables.length) {
      status.textContent = "Gerçek emsal ilanlar aranıyor...";
      comparables = await findComparables(vehicle);
    }

    status.textContent = "Veriler CarVision AI'a gönderiliyor...";

    const transferVehicle = {
      ...vehicle,
      images: Array.isArray(vehicle.images)
        ? vehicle.images.slice(0, 30)
        : [],
      thumbnailImages: Array.isArray(vehicle.thumbnailImages)
        ? vehicle.thumbnailImages.slice(0, 8)
        : [],
      interiorImages: Array.isArray(vehicle.interiorImages)
        ? vehicle.interiorImages.slice(0, 15)
        : [],
      exteriorImages: Array.isArray(vehicle.exteriorImages)
        ? vehicle.exteriorImages.slice(0, 15)
        : [],
      photoCount:
        typeof vehicle.photoCount === "number"
          ? vehicle.photoCount
          : Array.isArray(vehicle.images)
            ? vehicle.images.length
            : 0,
      description:
        typeof vehicle.description === "string"
          ? vehicle.description.slice(0, 3000)
          : undefined,
    };

    const response = await fetch(
      `${APP_URL}/api/extension-transfer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicle: transferVehicle,
          comparables,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result?.success || !result?.token) {
      throw new Error(
        result?.message ||
          "Veriler CarVision AI'a gönderilemedi."
      );
    }

    await chrome.tabs.create({
      url: `${APP_URL}/?extensionToken=${encodeURIComponent(
        result.token
      )}`,
      active: true,
    });

    status.textContent = `Araç ve ${comparables.length} emsal aktarıldı.`;
  } catch (error) {
    status.textContent =
      error instanceof Error
        ? error.message
        : "Araç bilgileri aktarılamadı.";
  } finally {
    button.disabled = false;
  }
});
