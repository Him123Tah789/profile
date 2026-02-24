"use client";

import { useEffect } from "react";

export function PageTracker({ path }: { path: string }) {
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "PAGE_VIEW", path })
    }).catch(() => undefined);
  }, [path]);

  return null;
}
