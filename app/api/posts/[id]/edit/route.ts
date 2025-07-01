import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const data = await req.json();

    try {
        const updated = await prisma.post.update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                price: data.price,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}
