import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PERSONAL_MODE, resolveApiKey } from "@/lib/personal";

export async function POST(req) {
  try {
    const session = PERSONAL_MODE ? null : await getServerSession(authOptions);

    if (!PERSONAL_MODE && !session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const apiKey = resolveApiKey({
      headerKey: req.headers.get("x-custom-api-key"),
      sessionKey: session?.user?.customApiKey,
    });
    if (!apiKey) {
      return new NextResponse("API Key not configured", { status: 500 });
    }

    const muapiFormData = new FormData();
    muapiFormData.append("file", file);

    const response = await fetch("https://api.muapi.ai/api/v1/upload_file", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
      },
      body: muapiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MuAPI Upload Failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
