async function waitForTabComplete(tabId) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      reject(new Error("Emsal arama sayfası zamanında yüklenemedi."));
    }, 20000);

    function listener(updatedTabId, changeInfo) {
      if (
        updatedTabId === tabId &&
        changeInfo.status === "complete"
      ) {
        clearTimeout(timeout);
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    }

    chrome.tabs.onUpdated.addListener(listener);
  });
}

async function getPageData(tabId) {
  return chrome.tabs.sendMessage(tabId, {
    type: "CARVISION_GET_PAGE_DATA",
  });
}

function createSearchUrl(vehicle) {
  const searchText = [
    vehicle.brand,
    vehicle.series,
    vehicle.model,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    "https://www.sahibinden.com/otomobil" +
    `?query_text=${encodeURIComponent(searchText)}`
  );
}

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message?.type !== "CARVISION_FIND_COMPARABLES") {
      return;
    }

    (async () => {
      let searchTabId;

      try {
        const vehicle = message.vehicle;

        if (!vehicle?.brand || !vehicle?.model) {
          throw new Error(
            "Emsal araması için marka ve model bilgisi eksik."
          );
        }

        const searchUrl = createSearchUrl(vehicle);

        const searchTab = await chrome.tabs.create({
          url: searchUrl,
          active: false,
        });

        if (!searchTab.id) {
          throw new Error("Emsal arama sekmesi açılamadı.");
        }

        searchTabId = searchTab.id;

        await waitForTabComplete(searchTabId);

        await new Promise((resolve) => {
          setTimeout(resolve, 2500);
        });

        const pageData = await getPageData(searchTabId);

        const comparables = Array.isArray(
          pageData?.comparables
        )
          ? pageData.comparables
          : [];

        sendResponse({
          success: true,
          comparables,
        });
      } catch (error) {
        sendResponse({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Emsal ilanlar alınamadı.",
          comparables: [],
        });
      } finally {
        if (searchTabId) {
          await chrome.tabs.remove(searchTabId).catch(() => {});
        }
      }
    })();

    return true;
  }
);
