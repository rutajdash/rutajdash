import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const origin = req.headers.get("origin");
  const originRegex = /^https?:\/\/(localhost:3000|rutajdash\.com)$/;
  if (!origin || !originRegex.test(origin)) {
    return NextResponse.json({ error: "Unauthorized Origin" }, { status: 403 });
  }

  const response = await fetch(
    "https://api.elevenlabs.io/v1/single-use-token/realtime_scribe",
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      },
    },
  );
  const data = await response.json();
  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
