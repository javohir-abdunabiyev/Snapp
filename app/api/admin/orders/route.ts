import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            items: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json({ orders });
}
