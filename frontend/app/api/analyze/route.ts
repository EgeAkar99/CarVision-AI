import { analyzeVehicle } from "../../../services/ai";
import { getVehicleFromListing } from "../../../services/vehicle";

type AnalyzeRequest = {
  listingUrl: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    const listingUrl = body.listingUrl?.trim();

    if (!listingUrl) {
      return Response.json(
        {
          success: false,
          message: "İlan linki zorunludur.",
        },
        { status: 400 }
      );
    }

    const vehicle = await getVehicleFromListing(listingUrl);

    const result = await analyzeVehicle(vehicle);

    return Response.json({
      success: true,
      listingUrl,
      result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Analiz sırasında bir hata oluştu.";

    return Response.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}