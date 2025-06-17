// app/api/posts/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // убедитесь, что путь правильный

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      }
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
