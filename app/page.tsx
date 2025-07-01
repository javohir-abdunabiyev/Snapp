// app/page.tsx
import HomePageClient from "@/components/custom/homepageclient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snapp — интернет-магазин в Самарканде",
  description: "Покупайте товары с доставкой по Самарканду. Удобно, быстро и просто.",
  keywords: ["Snapp", "интернет-магазин", "Самарканд", "доставка", "купить"],
  authors: [{ name: "Javohir", url: "https://snapp-one.vercel.app" }],
  openGraph: {
    title: "Snapp — интернет-магазин",
    description: "Лучшие товары с доставкой по Самарканду",
    url: "https://snapp-one.vercel.app",
    siteName: "Snapp",
    images: [
      {
        url: "https://snapp-one.vercel.app/images/adminNoPage.webp",
        width: 800,
        height: 600,
        alt: "Snapp превью",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  icons: {
    icon: "/images/faviconWeb.png",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
