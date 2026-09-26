import { prisma } from "@/lib/prisma";
import config from "@/lib/config";

/** Personal single-user mode: no login, no credits, env MuAPI key only. */
export const PERSONAL_MODE = process.env.PERSONAL_MODE !== "false";

const OWNER_EMAIL = "owner@local";

/**
 * Ensure a local owner user exists for Creation FK rows.
 */
export async function getPersonalUser() {
  const existing = await prisma.user.findUnique({
    where: { email: OWNER_EMAIL },
  });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      email: OWNER_EMAIL,
      name: "Owner",
      credits: 999999,
    },
  });
}

/**
 * Resolve the MuAPI key. Prefer env (server), then request overrides.
 */
export function resolveApiKey({ headerKey, bodyKey, sessionKey } = {}) {
  const fromEnv = config.ai?.aiclips?.apiKey || process.env.AICLIPS_API_KEY;
  if (PERSONAL_MODE && fromEnv) return fromEnv.trim();

  const candidate = headerKey || bodyKey || sessionKey || fromEnv;
  return candidate ? String(candidate).trim() : null;
}

/**
 * Identity for API routes: personal owner, or logged-in session user.
 */
export async function resolveUser(session) {
  if (PERSONAL_MODE) {
    return getPersonalUser();
  }
  if (session?.user?.id) {
    return { id: session.user.id, customApiKey: session.user.customApiKey };
  }
  return null;
}
