import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { PERSONAL_MODE, resolveUser } from "@/lib/personal";

export async function GET() {
  const session = PERSONAL_MODE ? null : await getServerSession(authOptions);
  const user = await resolveUser(session);

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const creations = await prisma.creation.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(creations);
  } catch (error) {
    console.error("Fetch creations error:", error);
    return NextResponse.json({ error: "Failed to fetch creations" }, { status: 500 });
  }
}
