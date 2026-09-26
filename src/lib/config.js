/**
 * Centralized configuration for the SaaS template.
 * All environment variables are validated and exported from here.
 */

const personalMode = process.env.PERSONAL_MODE !== "false";

const config = {
  appName: "Clips Studio",
  personalMode,
  theme: process.env.NEXT_PUBLIC_THEME || "emerald",
  auth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    webhook_url: process.env.WEBHOOK_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    plans: {
      default: {
        amount: 50,
        price: 900,
        currency: "usd",
      },
    },
  },
  ai: {
    aiclips: {
      apiKey: process.env.AICLIPS_API_KEY,
      youtubeEndpoint: "https://api.muapi.ai/api/v1/youtube-download",
      clippingEndpoint: "https://api.muapi.ai/api/v1/ai-clipping",
    },
  },
  db: {
    url: process.env.DATABASE_URL,
  },
};

const requiredKeys = personalMode
  ? [
      ["AICLIPS_API_KEY", config.ai.aiclips.apiKey],
      ["DATABASE_URL", config.db.url],
    ]
  : [
      ["GOOGLE_CLIENT_ID", config.auth.google.clientId],
      ["GOOGLE_CLIENT_SECRET", config.auth.google.clientSecret],
      ["STRIPE_SECRET_KEY", config.stripe.secretKey],
      ["DATABASE_URL", config.db.url],
      ["AICLIPS_API_KEY", config.ai.aiclips.apiKey],
    ];

if (typeof window === "undefined") {
  requiredKeys.forEach(([name, value]) => {
    if (!value) {
      console.warn(`[CONFIG] Warning: Missing critical environment variable: ${name}`);
    }
  });
}

export default config;
