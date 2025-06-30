"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Ответ сервера:", data);
                if (data.success) {
                    console.log("Успешный логин, редиректим");
                    window.location.assign("/admin/dashboard/");
                } else {
                    setError(data.message || "Неверный email или пароль");
                }
            } else {
                setError(`Ошибка сервера: ${res.status}`);
            }
        } catch (err) {
            setError("Ошибка сети или сервера");
            console.error("Login error:", err);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md mx-auto mt-10">
            <Input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-[500px] h-[40px] text-white !text-[18px] placeholder:text-[20px]"
            />
            <Input
                type="password"
                name="password"
                placeholder="Пароль"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="max-w-[500px] h-[40px] text-white !text-[18px] placeholder:text-[20px]"
            />
            <Button
                className="max-w-[500px] w-full font-bold text-[20px] h-[40px] rounded-[10px] text-black bg-white cursor-pointer"
            >
                Войти
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
    );
}