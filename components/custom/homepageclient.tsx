"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SlBasket } from "react-icons/sl";
import { MdHistory } from "react-icons/md";
import { useSession } from "next-auth/react";
import PostCard from "@/components/custom/PostCard";

type Post = {
    id: string;
    title: string;
    content: string;
    price: number;
    imageUrl: string;
};


export default function HomePageClient() {
    const { data: session } = useSession();
    const isAuth = !!session?.user;
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState("");


    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch("/api/posts", { cache: "no-store" });
            const data = await res.json();
            setPosts(data.posts);
            setFilteredPosts(data.posts);
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        const filtered = posts.filter((post) =>
            post.title.toLowerCase().includes(search.toLowerCase().trim())
        );
        setFilteredPosts(filtered);
    }, [search, posts]);

    return (
        <div className="mt-[50px] pl-[30px] pr-[30px]">
            <div className="flex items-center gap-[40px]">
                <h2 className="text-white text-[50px] font-bold max-w-[440px] w-full">Каталог</h2>

                <div className="w-full h-full flex items-center gap-[80px]">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="border-gray-400 max-w-[500px] h-[50px] placeholder:text-[15px] placeholder:font-600 text-white !text-[17px]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {isAuth && (
                        <nav className="flex items-center gap-[40px]">
                            <a href="/basket">
                                <button className="relative flex items-center justify-center w-[40px] h-[40px] rounded-[8px] cursor-pointer">
                                    <span className="w-full h-full rounded-[6px] flex items-center justify-center bg-[#242423] hover:bg-black transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                                        <SlBasket size={25} color="grey" />
                                    </span>
                                    <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1]" />
                                </button>
                            </a>
                            <a href="/orders">
                                <button className="relative flex items-center justify-center w-[40px] h-[40px] rounded-[8px] cursor-pointer">
                                    <span className="w-full h-full rounded-[6px] flex items-center justify-center bg-[#242423] hover:bg-black transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                                        <MdHistory size={25} color="grey" />
                                    </span>
                                    <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1]" />
                                </button>
                            </a>
                        </nav>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-4 mt-[30px] gap-4">
                {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} isAuth={isAuth} />
                ))}
            </div>
        </div>
    );
}
