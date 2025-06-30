import HomePageClient from "@/components/custom/homepageclient";
import Head from "next/head";


export default function HomePage() {
  return (
    <>
      <Head>
        <title>Snapp — интернет-магазин в Самарканде</title>
        <meta name="description" content="Покупайте товары с доставкой по Самарканду. Удобно, быстро и просто." />
        <meta name="keywords" content="Snapp, интернет-магазин, Самарканд, доставка, купить" />
        <meta name="Javohir" content="Snapp" />

        {/* OpenGraph / Соцсети */}
        <meta property="og:title" content="Snapp — интернет-магазин" />
        <meta property="og:description" content="Лучшие товары с доставкой по Самарканду" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://snapp.vercel.app" />
        <meta property="og:image" content="https://snapp.vercel.app/images/adminNoPage.webp" />
        <meta property="og:locale" content="ru_RU" />

        {/* Favicon */}
        <link rel="icon" href="/images/faviconWeb.png" />
      </Head>

      <HomePageClient />
    </>
  );
}
