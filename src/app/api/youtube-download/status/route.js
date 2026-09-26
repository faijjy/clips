import { NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai";
import { resolveApiKey } from "@/lib/personal";

export async function POST(req) {
  try {
    const body = await req.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json({ error: "requestId is required" }, { status: 400 });
    }

    const customApiKey = resolveApiKey({
      headerKey: req.headers.get("x-custom-api-key"),
      bodyKey: body.customApiKey,
    });

    const result = await AIService.checkStatus(requestId, customApiKey);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[YOUTUBE_DOWNLOAD_STATUS]", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
