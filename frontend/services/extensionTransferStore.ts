type ExtensionTransferPayload = {
  vehicle: unknown;
  comparables: unknown[];
  createdAt: number;
};

const TRANSFER_TTL_MS = 5 * 60 * 1000;

const globalStore = globalThis as typeof globalThis & {
  __carVisionExtensionTransfers?: Map<
    string,
    ExtensionTransferPayload
  >;
};

const transfers =
  globalStore.__carVisionExtensionTransfers ??
  new Map<string, ExtensionTransferPayload>();

globalStore.__carVisionExtensionTransfers = transfers;

export function saveExtensionTransfer(
  token: string,
  payload: Omit<ExtensionTransferPayload, "createdAt">
) {
  cleanupExpiredTransfers();

  transfers.set(token, {
    ...payload,
    createdAt: Date.now(),
  });
}

export function takeExtensionTransfer(
  token: string
): ExtensionTransferPayload | null {
  cleanupExpiredTransfers();

  const payload = transfers.get(token);

  if (!payload) {
    return null;
  }

  transfers.delete(token);

  return payload;
}

function cleanupExpiredTransfers() {
  const expirationTime = Date.now() - TRANSFER_TTL_MS;

  for (const [token, payload] of transfers.entries()) {
    if (payload.createdAt < expirationTime) {
      transfers.delete(token);
    }
  }
}
