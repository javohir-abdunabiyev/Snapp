import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import PostCard from "./PostCard";

export default async function PostsForClient() {
    const session = await getServerSession();

    const posts = await prisma.post.findMany({
        where: { published: true },
    });

    return (
        <div className="grid grid-cols-4 mt-[30px] gap-4">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} isAuth={!!session} />
            ))}
        </div>
    );
}
