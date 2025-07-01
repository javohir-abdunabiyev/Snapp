"use client";

import { useState } from "react";
import Link from "next/link";
import EditNameDialog from "./editusername";
import { useTranslations } from "next-intl";

export default function ClientProfile({ user, sessionImage }: { user: any; sessionImage?: any }) {
    const [name, setName] = useState(user.name);

    const handleUpdate = (newName: string) => {
        setName(newName);
    };

    const t = useTranslations("profile");

    return (
        <div className="p-10">
            <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
                ← {t("back")}
            </Link>
            <div className="flex flex-col items-center justify-center mt-5">
                <img
                    className="w-[130px] h-[130px] rounded-full mb-4"
                    src={sessionImage || "/images/userIcon.png"}
                    alt="Avatar"
                />
                <h1 className="text-3xl font-bold mb-4 text-white">{name}</h1>

                <EditNameDialog userId={user.id} currentName={name} onUpdate={handleUpdate} />

                <div className="text-left mt-4">
                    <p className="text-gray-500 font-bold text-[20px]">Email: {user.email}</p>
                    <p className={`text-white font-bold p-[10px] rounded-[8px] ${user.ban ? "bg-red-600" : "bg-green-600"}`}>
                        {t("status")}: {user.ban ? `${t("ban")}` : `${t("active")}`}
                    </p>
                </div>

                <div className="mt-6 text-white font-bold space-x-4">
                    <Link href="/basket">
                        <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-4 py-2 rounded">
                            🛒 {t("productsInBasket")}: {user.basket.items.length}
                        </button>
                    </Link>
                    <Link href="/orders">
                        <button className="bg-purple-600 cursor-pointer hover:bg-purple-700 px-4 py-2 rounded">
                            📦 {t("orders")}: {user.orders.length}
                        </button>
                    </Link>
                </div>
                <Link href={""} className="text-left mt-1">
                    <button className="bg-white cursor-pointer mt-[30px] font-bold w-full text-black cursor-pointer-700 px-4 py-2 rounded">
                        {t("support")}
                    </button>
                </Link>
            </div>
        </div>
    );
}
