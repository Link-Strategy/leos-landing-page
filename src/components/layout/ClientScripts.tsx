"use client";

import { useEffect } from "react";

export default function ClientScripts() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js");
    } else {
      // Dev chunks change constantly; a cached shell breaks hydration. Drop any SW left from prod builds.
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
    }
  }, []);

  return null;
}
