import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import ProductPage from "@/components/custom/productpage";
import { authOptions } from "@/lib/authOptions";

export default async function ProductPageWrapper({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const isAuth = !!session?.user?.email;

    const t = await getTranslations("catalog");

    return (
        <ProductPage
            id={params.id}
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
