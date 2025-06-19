import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, quantity } = await req.json();

    if (quantity < 1 || quantity > 10) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const updated = await prisma.basketItem.update({
        where: { id: itemId },
        data: { quantity },
    });

    return NextResponse.json({ success: true, item: updated });
}
