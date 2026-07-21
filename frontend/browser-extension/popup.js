const button = document.getElementById("send");
const status = document.getElementById("status");

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

    if (!response?.success) {
      return [];
    }

    return Array.isArray(response.comparables)
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

    let comparables = Array.isArray(pageData?.comparables)
      ? pageData.comparables
      : [];

    if (!vehicle?.brand || !vehicle?.model || !vehicle?.price) {
      throw new Error(
        "Araç bilgileri eksik okundu. İlan sayfasını yenileyip tekrar deneyin."
      );
    }

    if (comparables.length === 0) {
      status.textContent = "Gerçek emsal ilanlar aranıyor...";
      comparables = await findComparables(vehicle);
    }

    status.textContent = `${comparables.length} emsal bulundu. CarVision AI açılıyor...`;

    const transferVehicle = {
      ...vehicle,
      images: undefined,
      description:
        typeof vehicle.description === "string"
          ? vehicle.description.slice(0, 3000)
          : undefined,
    };

    const transferPayload = {
      vehicle: transferVehicle,
      comparables,
    };

    status.textContent = "Veriler CarVision AI'a gönderiliyor...";

    const transferResponse = await fetch(
      "http://localhost:3000/api/extension-transfer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferPayload),
      }
    );

    const transferResult = await transferResponse.json();

    if (
      !transferResponse.ok ||
      !transferResult?.success ||
      !transferResult?.token
    ) {
      throw new Error(
        transferResult?.message ||
          "Eklenti verileri CarVision AI'a gönderilemedi."
      );
    }

    await chrome.tabs.create({
      url: `http://localhost:3000/?extensionToken=${encodeURIComponent(
        transferResult.token
      )}`,
      active: true,
    });

    status.textContent =
      `Araç bilgileri ve ${comparables.length} emsal CarVision AI'a aktarıldı.`;
  } catch (error) {
    status.textContent =
      error instanceof Error
        ? error.message
        : "Araç bilgileri aktarılamadı.";
  } finally {
    button.disabled = false;
  }
});
