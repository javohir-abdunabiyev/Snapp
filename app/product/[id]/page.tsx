// app/product/[id]/page.ts

import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import ProductPage from "@/components/custom/productpage";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = await prisma.post.findUnique({
        where: { id },
        select: { title: true },
    });

    if (!product) {
        return {
            title: "Товар не найден",
            icons: { icon: "/images/faviconWeb.png" },
        };
    }

    const keywords = product.title.split(" ").slice(0, 10);

    return {
        title: product.title,
        keywords,
        icons: {
            icon: "/images/faviconWeb.png",
        },
    };
}

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
