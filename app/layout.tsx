import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import SwitchLang from "@/components/custom/SwitchLang";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import LoginBtn from "@/components/custom/loginBtn";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const t = await getTranslations("header");

  const sereverSession = await getServerSession();

  return (
    <html lang={locale}>
      <body>
        <SessionProvider session={sereverSession}>

          <header className="flex items-center pl-[2rem] justify-between h-[80px] w-full bg-black">
            <a href="/">
              <h2 className="text-[2.5rem] font-bold text-white">
                Snapp
              </h2>
            </a>
            <nav className="flex items-center gap-[25px]">
              <a href="/">
                <Button className="text-[18px] cursor-pointer rounded-[9999px] flex bg-[] hover:border-[0.0625rem] hover:border-solid hover:bg-[] p-[25px]">{t('home')}</Button>
              </a>
              <LoginBtn />
              <SwitchLang />
              <a href="#">
                <button className="bg-[#ff90e8] h-[80px] w-[135px] text-[25px] font-bold cursor-pointer">{t('about')}</button>
              </a>
            </nav>
          </header>

          <NextIntlClientProvider>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
