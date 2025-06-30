"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

export default function ClientBanButton({
    userId,
    isBanned,
}: {
    userId: string;
    isBanned: boolean;
}) {
    const [banStatus, setBanStatus] = useState(isBanned);
    const [isPending, startTransition] = useTransition();

    const handleBanUser = async () => {
        const res = await fetch(`/api/users/${userId}/ban`, {
            method: "PATCH",
        });

        if (res.ok) {
            setBanStatus((prev) => !prev);
        }
    };

    const t = useTranslations("adminUsers")

    return (
        <Button
            onClick={() => startTransition(handleBanUser)}
            disabled={isPending}
            className={
                banStatus
                    ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                    : "bg-green-500 hover:bg-green-600 cursor-pointer"
            }
        >
            <span className="text-white">{banStatus ? <span>{t("banned")}</span> : `${t("active")}`}</span>
        </Button>
    );
}
