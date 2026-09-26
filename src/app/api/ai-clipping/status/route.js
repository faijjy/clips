import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AIService } from "@/lib/services/ai";
import { PERSONAL_MODE, resolveApiKey } from "@/lib/personal";

export async function POST(req) {
  try {
    const session = PERSONAL_MODE ? null : await getServerSession(authOptions);

    if (!PERSONAL_MODE && !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
    }

    const customApiKey = resolveApiKey({
      headerKey: req.headers.get("x-custom-api-key"),
      bodyKey: body.customApiKey,
      sessionKey: session?.user?.customApiKey,
    });

    const result = await AIService.checkStatus(requestId, customApiKey);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[AICLIP_STATUS]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
