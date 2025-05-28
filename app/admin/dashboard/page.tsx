import { getTranslations } from "next-intl/server";

const page = async () => {
    const t = await getTranslations('admin');


    return (
        <div className="flex flex-col gap-[40px] text-center">
            
        </div>
    );
}

export default page;