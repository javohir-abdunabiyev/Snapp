// app/profile/[id]/page.tsx
import ClientProfile from "@/components/custom/ClientProfile";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const user = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            basket: { include: { items: true } },
            orders: true,
        },
    });

    const session = await getServerSession();

    if (!user) return notFound();

    return (
        <ClientProfile user={user} sessionImage={session?.user?.image} />
    );
}
