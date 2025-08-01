import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ban: !user.ban,
            },
        });

        return NextResponse.json({ ban: updatedUser.ban }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
