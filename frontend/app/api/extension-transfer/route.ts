export const runtime = "nodejs";

import {
  saveExtensionTransfer,
  takeExtensionTransfer,
} from "../../../services/extensionTransferStore";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

function createToken() {
  return crypto.randomUUID();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      vehicle?: unknown;
      comparables?: unknown[];
    };

    if (!body.vehicle) {
      return Response.json(
        {
          success: false,
          message: "Araç verisi zorunludur.",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const token = createToken();

    saveExtensionTransfer(token, {
      vehicle: body.vehicle,
      comparables: Array.isArray(body.comparables)
        ? body.comparables
        : [],
    });

    return Response.json(
      {
        success: true,
        token,
      },
      {
        headers: corsHeaders,
      }
    );
  } catch {
    return Response.json(
      {
        success: false,
        message: "Eklenti verisi kaydedilemedi.",
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token")?.trim();

  if (!token) {
    return Response.json(
      {
        success: false,
        message: "Transfer tokenı zorunludur.",
      },
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  const payload = takeExtensionTransfer(token);

  if (!payload) {
    return Response.json(
      {
        success: false,
        message:
          "Transfer verisi bulunamadı veya süresi doldu.",
      },
      {
        status: 404,
        headers: corsHeaders,
      }
    );
  }

  return Response.json(
    {
      success: true,
      vehicle: payload.vehicle,
      comparables: payload.comparables,
    },
    {
      headers: corsHeaders,
    }
  );
}
