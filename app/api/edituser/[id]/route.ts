import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { name } = await req.json();

    if (!name || typeof name !== "string")
        return NextResponse.json({ error: "Invalid name" }, { status: 400 });

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
