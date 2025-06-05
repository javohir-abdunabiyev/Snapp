'use client';

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations("admin");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null; // или можно отрендерить прелоадер

    const navItems = [
        { label: t("users"), path: "/admin/dashboard/users" },
        { label: t("orders"), path: "/admin/dashboard/orders" },
        { label: t("posts"), path: "/admin/dashboard/posts" },
        { label: t("addPost"), path: "/admin/dashboard/add-post" },
    ];

    return (
        <nav className="flex items-center border-b-[1px] max-w-[550px] gap-[40px] justify-center">
            {navItems.map(({ label, path }) => {
                const isActive = pathname === path;

                return (
                    <Button
                        key={path}
                        onClick={() => router.push(path)}
                        className={`cursor-pointer !rounded-[0px] bg-[] hover:bg-[] ${
                            isActive ? "text-white" : "text-gray-600 hover:text-white"
                        }`}
                    >
                        {label}
                    </Button>
                );
            })}
        </nav>
    );
}
