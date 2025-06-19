import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ items: [] });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            basket: {
                include: { items: true },
            },
        },
    });

    return NextResponse.json({ items: user?.basket?.items ?? [] });
}
