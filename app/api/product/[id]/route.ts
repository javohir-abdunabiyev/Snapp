import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const product = await prisma.post.findUnique({
            where: { id: params.id },
        });

        if (!product) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
