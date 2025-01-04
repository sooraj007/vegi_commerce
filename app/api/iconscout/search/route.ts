import { NextResponse } from "next/server";

const ICONSCOUT_API_KEY = process.env.ICONSCOUT_API_KEY;
const ICONSCOUT_API_URL = "https://api.iconscout.com/v3";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!ICONSCOUT_API_KEY) {
      return NextResponse.json(
        { error: "IconScout API key not configured" },
        { status: 500 }
      );
    }

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${ICONSCOUT_API_URL}/search?query=${encodeURIComponent(
        query
      )}&product_type=icons&price=free&per_page=32`,
      {
        headers: {
          "Client-ID": ICONSCOUT_API_KEY,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from IconScout API");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("IconScout API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch icons" },
      { status: 500 }
    );
  }
}
