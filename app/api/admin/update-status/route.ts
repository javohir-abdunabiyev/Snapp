import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });

    return NextResponse.json({ success: true });
}
