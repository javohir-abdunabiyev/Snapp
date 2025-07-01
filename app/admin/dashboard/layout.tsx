import AdminNav from "@/components/custom/adminNav";
import { getTranslations } from "next-intl/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const t = await getTranslations("admin");

    return (
        <div className="m-[30px]">
            <h3 className="text-[50px] font-bold text-white mb-[20px]">{t('welcomePanel')}</h3>
            <AdminNav />
            <main>{children}</main>
        </div>
    );
}