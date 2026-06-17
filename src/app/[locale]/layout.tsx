import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const url = `https://ownjoy.app/${locale}`;
  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://ownjoy.app"),
    alternates: {
      canonical: url,
      languages: {
        ko: "https://ownjoy.app/ko",
        en: "https://ownjoy.app/en",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      siteName: "Ownjoy",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      type: "website",
    },
    icons: {
      icon: "/icon-handshake.png",
      apple: "/icon-handshake.png",
    },
  };
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
