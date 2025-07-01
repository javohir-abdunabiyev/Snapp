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

export default function EditNameDialog({
    userId,
    currentName,
    onUpdate,
}: {
    userId: string;
    currentName: string;
    onUpdate: (name: string) => void;
}) {
    const [name, setName] = useState(currentName);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const t = useTranslations("profile")

    const handleSave = async () => {
        if (!name.trim()) return alert("Введите имя");

        setLoading(true);

        const res = await fetch(`/api/edituser/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        if (res.ok) {
            onUpdate(name);
            setOpen(false);
        } else {
            alert("Ошибка при обновлении");
        }

        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">{t("editUsername")}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("editUsername")}</DialogTitle>
                </DialogHeader>
                <input
                    type="text"
                    className="border p-2 w-full rounded bg-black text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="relative flex items-center rounded-[8px] justify-center w-full h-[40px] cursor-pointer hover:bg-[#ff90e8]"
                >
                    <span className="rounded-[8px] flex items-center h-[40px] justify-center bg-black text-white !w-full transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                        {loading ? `${t("saving")}` : `${t("save")}`}
                    </span>
                </button>
            </DialogContent>
        </Dialog>
    );
}
