"use client";

import { EditDialog } from "@/components/custom/editDialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";

export default function AddPost() {
    const [posts, setPosts] = useState<any[]>([]);

    const t = useTranslations("adminPosts");

    useEffect(() => {
        fetch("/api/posts")
            .then((res) => res.json())
            .then((data) => setPosts(data.posts));
    }, []);

    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        const res = await fetch(`/api/posts/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setPosts((prev) => prev.filter((post) => post.id !== id));
        } else {
            alert("Failed to delete the post.");
        }
    };

    if (posts.length === 0) {
        return (
            <div className="flex justify-center bg-black mt-[30px] pb-[20px]">
                <div className="flex flex-col text-center mt-[30px]">
                    <img src="/images/postpagebg.svg" alt="" draggable="false" className="w-[525px] h-[525px]" />
                    <p className="text-white text-[20px] font-semibold mt-[10px]">{t("noPosts")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 mt-[30px] gap-4">
            {posts.map((post) => (
                <div key={post.id} className="relative max-w-[400px] rounded-[8px] cursor-pointer">
                    <span className="w-full h-full rounded-[6px] flex flex-col justify-between p-[20px] bg-black transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem] text-white">
                        <div className="border-b-[1px] border-y-gray-700">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full max-h-[160px] object-contain mb-[20px]"
                                draggable="false"
                            />
                        </div>
                        <div className="flex flex-col justify-between min-h-[140px]">
                            <h3 className="text-[20px] font-semibold mt-[5px] mb-[10px]">{post.title}</h3>
                            <p className="line-clamp-2 text-gray-400 break-words break-all">
                                {post.content ? post.content : "(There is no content for this post)"}
                            </p>
                            <div className="flex items-center justify-between mt-[10px]">
                                <p>{post.price}$</p>
                                <div className="flex items-center gap-2">
                                    <EditDialog
                                        post={post}
                                        onUpdate={(updatedPost) =>
                                            setPosts((prev) =>
                                                prev.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p))
                                            )
                                        }

                                    />
                                    <Button
                                        className="cursor-pointer bg-red-500 hover:bg-red-600"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        {t("delete")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </span>
                    <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1] transform transition-all duration-150 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
            ))}
        </div>
    );
}