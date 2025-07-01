import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const data = await req.json();

    if (!data.name || typeof data.name !== "string") {
        return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name: data.name },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
