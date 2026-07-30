import { chromium, type Browser } from "playwright";

export type SahibindenClientResponse = {
  html: string;
  finalUrl: string;
};

export class SahibindenClientError extends Error {
  statusCode: number;
  code:
    | "ACCESS_BLOCKED"
    | "NOT_FOUND"
    | "INVALID_CONTENT"
    | "EMPTY_RESPONSE"
    | "REQUEST_FAILED";

  constructor(
    message: string,
    statusCode: number,
    code: SahibindenClientError["code"]
  ) {
    super(message);
    this.name = "SahibindenClientError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

function isAccessBlocked(html: string): boolean {
  const normalizedHtml = html.toLocaleLowerCase("tr-TR");

  return (
    normalizedHtml.includes("access denied") ||
    normalizedHtml.includes("erişim engellendi") ||
    normalizedHtml.includes("güvenlik kontrolü") ||
    normalizedHtml.includes("robot olmadığınızı doğrulayın") ||
    normalizedHtml.includes("captcha")
  );
}

export async function fetchSahibindenListing(
  listingUrl: string
): Promise<SahibindenClientResponse> {
  let browser: Browser | undefined;

  try {
    browser = await chromium.launch({
      headless: true,
    });

    const context = await browser.newContext({
      locale: "tr-TR",
      timezoneId: "Europe/Istanbul",
      viewport: {
        width: 1440,
        height: 1000,
      },
      userAgent:
        "Mozilla/5.0 (Macintosh; Apple Silicon Mac OS X 10_15_7) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/149.0.0.0 Safari/537.36",
      extraHTTPHeaders: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    const page = await context.newPage();

    const response = await page.goto(listingUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    if (!response) {
      throw new SahibindenClientError(
        "İlan sayfasından yanıt alınamadı.",
        502,
        "REQUEST_FAILED"
      );
    }

    const status = response.status();

    if (status === 403) {
      throw new SahibindenClientError(
        "Sahibinden ilan sayfasına erişimi engelledi. Manuel araç girişiyle devam edebilirsiniz.",
        403,
        "ACCESS_BLOCKED"
      );
    }

    if (status === 404) {
      throw new SahibindenClientError(
        "İlan bulunamadı veya yayından kaldırılmış.",
        404,
        "NOT_FOUND"
      );
    }

    if (status < 200 || status >= 400) {
      throw new SahibindenClientError(
        `İlan sayfasına erişilemedi. HTTP durum kodu: ${status}`,
        status,
        "REQUEST_FAILED"
      );
    }

    const contentType = response.headers()["content-type"] ?? "";

    if (
      contentType &&
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new SahibindenClientError(
        "İlan sayfasından geçerli HTML içeriği alınamadı.",
        502,
        "INVALID_CONTENT"
      );
    }

    await page
      .waitForLoadState("networkidle", {
        timeout: 10_000,
      })
      .catch(() => undefined);

    if (page.url().includes("/cs/tloading")) {
      const continueButton = page.getByText("Devam Et", {
        exact: true,
      });

      if (await continueButton.isVisible().catch(() => false)) {
        await continueButton.click();

        await page
          .waitForLoadState("domcontentloaded", {
            timeout: 15_000,
          })
          .catch(() => undefined);

        await page.waitForTimeout(3_000);
      }
    }

    if (page.url().includes("/cs/tloading")) {
      throw new SahibindenClientError(
        "Sahibinden güvenlik kontrolü URL üzerinden otomatik erişimi engelledi. Tarayıcı uzantısıyla veya manuel girişle devam edebilirsiniz.",
        403,
        "ACCESS_BLOCKED"
      );
    }

    const html = await page.content();

    if (!html.trim()) {
      throw new SahibindenClientError(
        "İlan sayfasının içeriği boş döndü.",
        502,
        "EMPTY_RESPONSE"
      );
    }

    if (isAccessBlocked(html)) {
      throw new SahibindenClientError(
        "Sahibinden güvenlik kontrolü nedeniyle ilan bilgilerine erişilemedi. Manuel araç girişiyle devam edebilirsiniz.",
        403,
        "ACCESS_BLOCKED"
      );
    }

    return {
      html,
      finalUrl: page.url(),
    };
  } catch (error) {
    if (error instanceof SahibindenClientError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Bilinmeyen bağlantı hatası.";

    throw new SahibindenClientError(
      `İlan sayfasına bağlantı kurulamadı: ${message}`,
      502,
      "REQUEST_FAILED"
    );
  } finally {
    await browser?.close().catch(() => undefined);
  }
}