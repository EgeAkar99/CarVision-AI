type AnalyzeRequest = {
  listingUrl: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;

    if (!body.listingUrl || !body.listingUrl.trim()) {
      return Response.json(
        {
          success: false,
          message: "İlan linki zorunludur.",
        },
        { status: 400 }
      );
    }

    const result = {
      title: "BMW 320i ED",
      year: 2018,
      listingPrice: "1.250.000 TL",
      marketPrice: "1.285.000 TL",
      score: 91,
    };

    return Response.json({
      success: true,
      listingUrl: body.listingUrl,
      result,
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Analiz sırasında bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}