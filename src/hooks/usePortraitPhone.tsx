"use client";
import { useState, useEffect } from "react";

export default function usePortraitPhone() {
  const [portraitPhone, setPortraitPhone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 639px) and (orientation: portrait)");
    const onChange = (e: MediaQueryListEvent) => setPortraitPhone(e.matches);

    setPortraitPhone(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return portraitPhone;
}
