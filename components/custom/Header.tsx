// components/custom/Header.tsx

"use client";

import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import SwitchLang from "./SwitchLang";
import LoginBtn from "./loginBtn";

export default function Header({
    session,
    currentUserId,
}: {
    session: any;
    currentUserId: string | null;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("header");

    return (
        <header className="relative bg-black px-[30px] py-4 w-full flex items-center justify-between z-50">
            {/* Логотип */}
            <a href="/">
                <h2 className="text-[2.5rem] font-bold text-white">Snapp</h2>
            </a>

            {/* DESKTOP */}
            <nav className="hidden sm:flex items-center gap-[25px]">
                <a href="/">
                    <Button className="text-[18px] cursor-pointer rounded-[9999px] flex hover:border-[0.0625rem] p-[25px]">
                        {t("home")}
                    </Button>
                </a>


                <LoginBtn />

                {session?.user && currentUserId && (
                    <a href={`/profile/${currentUserId}`}>
                        <img
                            className="w-[40px] h-[40px] rounded-full object-cover cursor-pointer"
                            src={session.user.image || "/images/userIcon.png"}
                            alt="User Avatar"
                        />
                    </a>
                )}

                <SwitchLang />
                <a href="#">
                    <button className="bg-[#ff90e8] h-[80px] px-[10px] text-[25px] font-bold cursor-pointer">
                        {t("support")}
                    </button>
                </a>

            </nav>


            {/* MOBILE right block */}
            <div className="flex items-center sm:hidden gap-3">
                <SwitchLang />

                {session?.user && currentUserId && (
                    <a href={`/profile/${currentUserId}`}>
                        <img
                            className="w-[36px] h-[36px] rounded-full object-cover cursor-pointer"
                            src={session.user.image || "/images/userIcon.png"}
                            alt="User Avatar"
                        />
                    </a>
                )}

                <button
                    onClick={() => setIsOpen(true)}
                    className="text-white text-3xl"
                >
                    <RxHamburgerMenu />
                </button>
            </div>

            {/* BACKDROP */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* MOBILE MENU */}
            <div
                className={`fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-[#1a1a1a] z-50 flex flex-col p-6 gap-6 shadow-lg transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-white text-3xl self-end hover:text-red-400 transition"
                >
                    <IoClose />
                </button>

                <nav className="flex flex-col w-full text-white gap-4">
                    <a
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-left py-2 px-3 rounded hover:bg-gray-800 transition border-b border-gray-700"
                    >
                        {t("home")}
                    </a>

                    <div className="border-b border-gray-700">
                        <LoginBtn />
                    </div>

                    <a
                        href="#"
                        onClick={() => setIsOpen(false)}
                        className="bg-[#ff90e8] hover:bg-pink-400 text-black font-bold py-2 px-4 rounded text-center transition"
                    >
                        {t("support")}
                    </a>
                </nav>
            </div>
        </header>
    );
}
