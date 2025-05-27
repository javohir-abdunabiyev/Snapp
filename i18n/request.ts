import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
    const locales = ["en", "ru"];
    const cookieStore = (await cookies()) as any;
    let locale = cookieStore.get("locale")?.value || "en";

    if(!locales.includes(locale)) {
        locale = "en";
    }


    return {
        locale,
        messages: (await import(`../langs/${locale}.json`)).default
    };
});