"use client";

import { useEffect } from "react";
import config from "@/lib/config";

export function Providers({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const theme = config?.theme || "emerald";
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  return children;
}
