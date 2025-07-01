import { NextIntlClientProvider } from "next-intl";
import "./globals.css";
import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import SwitchLang from "@/components/custom/SwitchLang";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import LoginBtn from "@/components/custom/loginBtn";
import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const t = await getTranslations("header");
  const f = await getTranslations("footer");

  const sereverSession = await getServerSession();

  let currentUserId: string | null = null;

  if (sereverSession?.user?.email) {
    const userInDb = await prisma.user.findUnique({
      where: { email: sereverSession.user.email },
      select: { id: true },
    });

    if (userInDb) {
      currentUserId = userInDb.id;
    }
  }

  return (
    <html lang={locale} className="h-full">
      <body className="flex flex-col min-h-screen">
        <SessionProvider session={sereverSession}>
          <header className="flex items-center pl-[2rem] justify-between h-[80px] w-full bg-black">
            <a href="/">
              <h2 className="text-[2.5rem] font-bold text-white">Snapp</h2>
            </a>
            <nav className="flex items-center gap-[25px]">
              <a href="/">
                <Button className="text-[18px] cursor-pointer rounded-[9999px] flex bg-[] hover:border-[0.0625rem] hover:border-solid hover:bg-[] p-[25px]">
                  {t("home")}
                </Button>
              </a>

              <LoginBtn />

              {sereverSession?.user && currentUserId && (
                <a href={`/profile/${currentUserId}`}>
                  <img
                    className="w-[40px] h-[40px] rounded-full object-cover cursor-pointer"
                    src={sereverSession.user.image || "/images/userIcon.png"}
                    alt="User Avatar"
                  />
                </a>
              )}

              <SwitchLang />

              <a href="#">
                <button className="bg-[#ff90e8] h-[80px] pl-[10px] pr-[10px] text-[25px] font-bold cursor-pointer">
                  {t("support")}
                </button>
              </a>
            </nav>
          </header>

          <main className="flex-1">
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </main>
          <footer className="bg-black text-gray-400 border-t border-gray-800 mt-16">
            <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-white text-xl font-semibold">Snapp</h2>
                <p className="text-sm mt-1">© {new Date().getFullYear()} {f("rights")}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="/" className="hover:text-white transition">{f("home")}</a>
                <a href="#" className="hover:text-white transition">{f("support")}</a>
                <p className="hover:text-white transition">{f("contact")}: +998 999-99-99</p>
              </div>
            </div>
          </footer>


        </SessionProvider>
      </body>
    </html>
  );
}
