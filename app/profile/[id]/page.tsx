import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ClientProfile from "@/components/custom/ClientProfile";
import { authOptions } from "@/lib/authOptions";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id: id },
        select: { name: true },
    });

    if (!user) {
        return {
            title: "Профиль не найден",
            robots: { index: false, follow: false },
        };
    }

    return {
        title: `Профиль ${user.name || "пользователя"} - Snapp`,
        icons: {
            icon: "/images/faviconWeb.png",
        },
        robots: {
            index: false,
            follow: false,
        },
    };
}


export default async function ProfilePageWrapper({
    params,
}: {
    params: Promise<{ id: string }>;
}) {

    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id: id },
        include: {
            basket: { include: { items: true } },
            orders: true,
        },
    });

    const session = await getServerSession(authOptions);

    if (!user) return notFound();

    return <ClientProfile user={user} sessionImage={session?.user?.image} />;
}
