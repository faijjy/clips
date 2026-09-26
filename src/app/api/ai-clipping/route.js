import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AIService } from "@/lib/services/ai";
import { PERSONAL_MODE, resolveApiKey, resolveUser } from "@/lib/personal";

export async function POST(req) {
  try {
    const session = PERSONAL_MODE ? null : await getServerSession(authOptions);
    const user = await resolveUser(session);

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { video_url, num_highlights, aspect_ratio } = body;

    if (!video_url) {
      return NextResponse.json({ error: "Video URL is required" }, { status: 400 });
    }

    const customApiKey = resolveApiKey({
      headerKey: req.headers.get("x-custom-api-key"),
      bodyKey: body.customApiKey,
      sessionKey: session?.user?.customApiKey,
    });

    if (!customApiKey) {
      return NextResponse.json(
        { error: "AICLIPS_API_KEY is not configured on the server" },
        { status: 500 }
      );
    }

    const result = await AIService.aiClipping(user.id, {
      video_url,
      num_highlights,
      aspect_ratio,
      customApiKey,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error.message === "Insufficient credits") {
      return new NextResponse("Insufficient credits", { status: 403 });
    }
    console.error("[AI_CLIPPING]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
