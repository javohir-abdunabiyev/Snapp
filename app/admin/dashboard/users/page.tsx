import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function User() {
    const posts = await prisma.user.findMany({
        include: {
            basket: {
                include: {
                    items: true,
                },
            },
        },
    });

    const t = await getTranslations("admin");

    return (
        <div className="grid grid-cols-4 mt-[30px] gap-4">
            {posts.map((post) => (
                <Link
                    key={post.id}
                    href={`/admin/dashboard/users/${post.id}`}
                    className="relative max-w-[400px] h-[200px] rounded-[8px] cursor-pointer"
                >
                    <span className="w-full h-full rounded-[6px] flex justify-between p-[20px] bg-black transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem] text-white">
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-[30px] font-medium truncate max-w-[200px] overflow-hidden whitespace-nowrap">
                                    {post.name}
                                </h2>
                                <p className="text-sm text-gray-400">{post.email}</p>
                            </div>
                            <div>
                                {post.ban ? (
                                    <Button className="bg-red-500 hover:bg-[]">
                                        <span className="text-white">{t("ban")}</span>
                                    </Button>
                                ) : (
                                    <Button className="bg-green-500 hover:bg-[]">
                                        <span className="text-white">{t("active")}</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                            <img
                                src="/images/userIcon.png"
                                alt=""
                                className="!max-w-[100px] !max-h-[100px] rounded-full"
                            />
                            <p className="text-sm mt-1 font-bold">
                                🛒 {t("basket")}: {post.basket?.items.length ?? 0}
                            </p>
                        </div>
                    </span>
                    <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1] transform transition-all duration-150 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0" />
                </Link>
            ))}
        </div>
    );
}
