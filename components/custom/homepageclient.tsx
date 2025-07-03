"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SlBasket } from "react-icons/sl";
import { MdHistory } from "react-icons/md";
import { useSession } from "next-auth/react";
import PostCard from "@/components/custom/PostCard";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

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
    const [loading, setLoading] = useState(true);
    const t = useTranslations("catalog");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/posts", { cache: "no-store" });
                const data = await res.json();
                setPosts(data.posts);
                setFilteredPosts(data.posts);
            } catch (error) {
                console.error("Failed to load posts", error);
            } finally {
                setLoading(false);
            }
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
        <div className="mt-[50px] px-[30px]">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[20px] xl:gap-[40px]">
                <h2 className="text-white text-[50px] font-bold max-w-[440px] w-full">
                    {t("catalogTXT")}
                </h2>

                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-[20px] sm:gap-[40px] xl:gap-[80px]">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="border-gray-400 w-full sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] h-[50px] placeholder:text-[15px] placeholder:font-600 text-white !text-[17px]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {isAuth && (
                        <nav className="flex items-center gap-[20px] sm:gap-[30px] xl:gap-[40px]">
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

            {loading ? (
                <div className="flex justify-center items-center h-[300px]">
                    <Loader2 className="animate-spin w-10 h-10 text-gray-400" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-[30px]">
                    {filteredPosts.map((post) => (
                        <PostCard key={post.id} post={post} isAuth={isAuth} />
                    ))}
                </div>
            )}
        </div>
    );
}
