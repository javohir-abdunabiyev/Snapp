import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import ProductPage from "@/components/custom/productpage";
import { authOptions } from "@/lib/authOptions";

export default async function ProductPageWrapper({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    const isAuth = !!session?.user?.email;

    const t = await getTranslations("catalog");

    return (
        <ProductPage
            id={id}
            isAuth={isAuth}
            translations={{
                back: t("backtoproducts"),
                noDescription: t("nodescription"),
                registerPrompt: t("registerprompt"),
                addToBasket: t("addtobasket"),
                removeFromBasket: t("deletefrombasket"),
            }}
        />
    );
}
