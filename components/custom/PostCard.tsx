"use client";

import { useEffect, useState } from "react";
import { SlBasket } from "react-icons/sl";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function PostCard({ post, isAuth }: { post: any; isAuth: boolean }) {
    const [inBasket, setInBasket] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkBasket = async () => {
            const res = await fetch("/api/basket/items");
            const data = await res.json();
            const titles = data.items.map((item: any) => item.title);
            setInBasket(titles.includes(post.title));
        };

        if (isAuth) checkBasket();
    }, [isAuth, post.title]);

    const addToBasket = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation?.(); // 🔥 важная строка

        await fetch("/api/basket/add", {
            method: "POST",
            body: JSON.stringify({ postId: post.id }),
        });

        setInBasket(true);
    };


    const handleCardClick = () => {
        router.push(`/product/${post.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="relative max-w-[400px] rounded-[8px] text-left w-full cursor-pointer"
        >
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
                        {post.content || "(There is no content for this post)"}
                    </p>
                    <div className="flex items-center justify-between mt-[10px]">
                        <p>{post.price}$</p>
                        {isAuth ? (
                            inBasket ? (
                                <FaCheckCircle size={40} color="#ff90e8" />
                            ) : (
                                <button
                                    onClick={addToBasket}
                                    className="flex justify-center items-center w-[40px] h-[40px] rounded-full border-[1px] border-gray-400 hover:bg-black hover:border-gray-500 transition-colors duration-150 ease-in-out cursor-pointer"
                                >
                                    <SlBasket size={20} color="white" />
                                </button>
                            )
                        ) : null}
                    </div>
                </div>
            </span>
            <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1]" />
        </div>
    );
}
