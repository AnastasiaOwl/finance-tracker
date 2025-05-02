"use client";
import { useEffect } from "react";

export default function ClientSafeViewport({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const update = () => {
      document.documentElement.style.setProperty("--vw", `${window.innerWidth / 100}px`);
      document.documentElement.style.setProperty("--vh", `${window.innerHeight / 100}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return <>{children}</>;
}
