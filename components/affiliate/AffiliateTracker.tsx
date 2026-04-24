"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;

    // Avoid tracking same session twice
    const key = `aff_tracked_${ref}`;
    if (sessionStorage.getItem(key)) return;

    // Fire and forget — don't block the page
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handle: ref,
        referrerUrl: document.referrer || null,
      }),
    })
      .then(() => sessionStorage.setItem(key, "1"))
      .catch(() => {}); // silently ignore errors
  }, [searchParams]);

  return null;
}
