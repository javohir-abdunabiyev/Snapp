"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function EditDialog({
    post,
    onUpdate,
}: {
    post: any;
    onUpdate: (post: any) => void;
}) {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content ?? "");
    const [price, setPrice] = useState(post.price);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const t = useTranslations("adminPosts");

    const handleSubmit = async () => {
        if (!title.trim() || price <= 0) {
            alert("Заполните обязательные поля: заголовок и цена.");
            return;
        }

        setLoading(true);

        const res = await fetch(`/api/posts/${post.id}/edit/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, price }),
        });

        if (res.ok) {
            const updated = await res.json();
            onUpdate(updated);
            setOpen(false);
        } else {
            alert("Ошибка при обновлении поста.");
        }

        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">{t("edit")}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("editPost")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="text-white placeholder:text-gray-500 w-full px-4 py-2 border border-gray-300 rounded-md bg-black focus:outline-none focus:ring-2 focus:ring-white transition"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content"
                        className="text-white placeholder:text-gray-500 w-full px-4 py-2 border border-gray-300 rounded-md bg-black focus:outline-none focus:ring-2 focus:ring-white transition min-h-[120px]"
                    />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        placeholder="Price"
                        className="text-white placeholder:text-gray-500 w-full px-4 py-2 border border-gray-300 rounded-md bg-black focus:outline-none focus:ring-2 focus:ring-white transition"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="relative flex items-center rounded-[8px] justify-center w-full h-[40px] cursor-pointer hover:bg-[#ff90e8]"
                    >
                        <span className="rounded-[8px] flex items-center h-[40px] justify-center bg-black text-white !w-full transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                            {loading ? t("saving") : t("saveChanges")}
                        </span>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
