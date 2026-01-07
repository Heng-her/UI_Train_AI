"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getViewerId } from "@/lib/viewer";

export function ViewerTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const viewerId = getViewerId();

    const postData = {
      viewerId,
      page: {
        url: window.location.href,
        route: pathname, // Use usePathname() for the route
        referrer: document.referrer,
      },
      activity: {
        lastEvent: "load",
        scrollY: window.scrollY,
      },
      visibility: {
        state: document.visibilityState,
      },
      device: {
        userAgent: navigator.userAgent,
        screen: {
          width: window.screen.width,
          height: window.screen.height,
        },
        language: navigator.language,
      },
    };

    fetch("/api/viewer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    }).catch(console.error);
    
  }, [pathname]); // Rerun on page change

  return null; // This component doesn't render anything
}
