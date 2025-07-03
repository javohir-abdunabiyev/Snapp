import "./globals.css";
import { getLocale, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import Header from "@/components/custom/Header";
import prisma from "@/lib/prisma";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = await getTranslations("footer");

  const serverSession = await getServerSession();

  let currentUserId: string | null = null;

  if (serverSession?.user?.email) {
    const userInDb = await prisma.user.findUnique({
      where: { email: serverSession.user.email },
      select: { id: true },
    });

    if (userInDb) {
      currentUserId = userInDb.id;
    }
  }

  return (
    <html lang={locale}>
      <body className="flex flex-col min-h-screen">
        <SessionProvider session={serverSession}>
          <NextIntlClientProvider locale={locale}>
            <Header session={serverSession} currentUserId={currentUserId} />

            <main className="flex-1">{children}</main>

            <footer className="bg-black text-gray-400 border-t border-gray-800 mt-[50px]">
              <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-white text-xl font-semibold">Snapp</h2>
                  <p className="text-sm mt-1">© {t("rights")}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <a href="/" className="hover:text-white transition">
                    {t("home")}
                  </a>
                  <a href="https://t.me/javohir_abdunabiyev" className="hover:text-white transition">
                    {t("support")}
                  </a>
                  <p className="hover:text-white transition">
                    {t("contact")}: +998 999-99-99
                  </p>
                </div>
              </div>
            </footer>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
