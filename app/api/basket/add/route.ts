import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let basket = await prisma.basket.findUnique({
        where: { userId: user.id },
    });

    if (!basket) {
        basket = await prisma.basket.create({
            data: { userId: user.id },
        });
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existingItem = await prisma.basketItem.findFirst({
        where: {
            basketId: basket.id,
            title: post.title,
        },
    });

    if (existingItem) {
        return NextResponse.json({ success: true });
    }

    await prisma.basketItem.create({
        data: {
            basketId: basket.id,
            title: post.title,
            imageUrl: post.imageUrl,
            price: post.price,
            quantity: 1,
        },
    });

    return NextResponse.json({ success: true });
}
