"use client";
import usePortraitPhone from "@/hooks/usePortraitPhone";

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const portraitPhone = usePortraitPhone();

  if (portraitPhone) {
    return (
      <div
        className="
          fixed inset-0
          flex items-center justify-center
          bg-black/90 text-white text-center p-4
          z-50
        "
      >
        <p className="text-lg">
          Цей інтерфейс краще працює в альбомному режимі.  
          Поверніть, будь ласка, телефон на бік.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
