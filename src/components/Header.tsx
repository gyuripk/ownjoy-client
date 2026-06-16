"use client";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5 z-1000 shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        <Image
          src="/icon-handshake-2.png"
          alt="logo"
          width={42}
          height={42}
          priority
          unoptimized
          style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))" }}
        />
        <div>
          <span className="text-base font-extrabold text-gray-900">
            {t("title")}
          </span>
          <p className="text-xs text-gray-400">{t("subtitle")}</p>
        </div>
      </div>
      <Tabs value={locale} onValueChange={handleSwitch}>
        <TabsList
          className="relative h-auto rounded-full p-1 gap-0"
          style={{
            background: "#e5e7eb",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.12), inset 0 1px 2px rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="absolute top-1 bottom-1 rounded-full pointer-events-none transition-all duration-300 ease-in-out"
            style={{
              width: "calc(50% - 4px)",
              left: "4px",
              transform: locale === "en" ? "translateX(100%)" : "translateX(0)",
              background:
                locale === "ko"
                  ? "linear-gradient(135deg, #f43f5e, #be123c)"
                  : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          />
          <TabsTrigger
            value="ko"
            className="relative z-10 h-auto rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-300"
            style={{
              background: "transparent",
              boxShadow: "none",
              color: locale === "ko" ? "white" : "#9ca3af",
            }}
          >
            KO
          </TabsTrigger>
          <TabsTrigger
            value="en"
            className="relative z-10 h-auto rounded-full px-3 py-1.5 text-xs font-bold transition-colors duration-300"
            style={{
              background: "transparent",
              boxShadow: "none",
              color: locale === "en" ? "white" : "#9ca3af",
            }}
          >
            EN
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
}
