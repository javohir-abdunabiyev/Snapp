"use client";

import { useEffect, useState } from "react";
import QuantityController from "@/components/custom/QuantityCont";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createOrder } from "../actions/order";
import Form from "next/form";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function BasketPage() {
    const t = useTranslations("basket");

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBanned, setIsBanned] = useState(false);

    useEffect(() => {
        (async () => {
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();
            if (!session?.user?.email) {
                redirect("/");
            }

            const userRes = await fetch("/api/user/me");
            const userData = await userRes.json();
            setIsBanned(userData.ban);

            const res = await fetch("/api/basket/items");
            const data = await res.json();
            setItems(data.items);
            setLoading(false);
        })();
    }, []);

    const updateItemQuantity = (id: string, newQty: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: newQty } : item
            )
        );
    };

    const handleDelete = async (itemId: string) => {
        await fetch("/api/basket/delete-item", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId }),
        });

        setItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    const totalPrice = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    if (loading) return <p className="text-white p-10 text-center">Loading...</p>;

    return (
        <div className="p-10 text-white">
            <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
                ← {t("back")}
            </Link>
            <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

            {items.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-[30px]">{t("empty")}</p>
                </div>
            ) : (
                <div className="grid grid-cols-[repeat(4,300px)] gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="relative max-w-[300px] rounded-[8px]">
                            <span className="w-full h-full rounded-[6px] flex flex-col justify-between p-[20px] bg-black text-white">
                                <div className="max-w-[300px] border-b-[1px] border-y-gray-700">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-[300px] h-[200px] object-contain mb-[10px]"
                                    />
                                </div>
                                <div className="flex flex-col justify-between min-h-[140px]">
                                    <h3 className="text-[20px] font-semibold mt-[5px] mb-[10px]">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-[10px]">
                                        <p>{item.price * item.quantity}$</p>
                                        <QuantityController
                                            itemId={item.id}
                                            quantity={item.quantity}
                                            onQuantityChange={(newQty) =>
                                                updateItemQuantity(item.id, newQty)
                                            }
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleDelete(item.id)}
                                    className="mt-[10px] bg-red-500 hover:bg-red-700 cursor-pointer"
                                >
                                    {t("remove")}
                                </Button>
                            </span>
                            <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1]" />
                        </div>
                    ))}

                    {!isBanned && (
                        <div className="fixed bottom-[40px] right-[20px]">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="relative flex items-center rounded-[8px] justify-center w-full h-[40px] cursor-pointer hover:bg-orange-500">
                                        <span className="rounded-[8px] p-[20px] flex items-center h-[40px] justify-center bg-[#ff90e8] text-black font-semibold !w-full transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                                            {t("checkout")}
                                        </span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t("checkoutTitle")}</DialogTitle>
                                        <DialogDescription>{t("checkoutDescription")}</DialogDescription>
                                        <b>{t("deliveryNote")}</b>
                                    </DialogHeader>
                                    <Form action={createOrder} className="flex flex-col">
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            placeholder={t("address")}
                                            className="mb-4 p-2 rounded border border-gray-300"
                                        />
                                        <input
                                            type="text"
                                            name="phone"
                                            required
                                            placeholder="+998..."
                                            pattern="\+998\d{9}"
                                            className="mb-4 p-2 rounded border border-gray-300"
                                        />
                                        <p className="text-lg font-bold mt-4">
                                            {t("total")}: {totalPrice}$
                                        </p>
                                        <button
                                            type="submit"
                                            className="relative flex items-center rounded-[8px] justify-center w-full h-[40px] cursor-pointer hover:bg-orange-500"
                                        >
                                            <span className="rounded-[8px] flex items-center h-[40px] justify-center bg-black text-white !w-full transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                                                {t("confirm")}
                                            </span>
                                        </button>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}

                    {isBanned && (
                        <div className="fixed bottom-[40px] right-[20px] text-red-500 font-semibold">
                            {t("Banned")}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
