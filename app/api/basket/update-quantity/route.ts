import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const { itemId, quantity } = await req.json();

    if (!itemId || typeof quantity !== "number") {
        return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
    }

    const item = await prisma.basketItem.update({
        where: { id: itemId },
        data: { quantity },
    });

    return NextResponse.json({ success: true, item });
}
