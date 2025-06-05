import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
    const t = await getTranslations("admin");
    return (
        <div className="bg-black text-center border-[1px] border-dashed border-gray-600 mt-[20px]">
            <img
                src="/images/adminNoPage.webp"
                alt=""
                draggable="false"
            />
            <p className="text-white text-[1.5rem] font-normal">{t('selectPage')}</p>
            <p className="text-white">{t('seeData')}</p>
        </div>
    );
}