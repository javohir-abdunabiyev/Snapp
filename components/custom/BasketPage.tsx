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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

export default function BasketPage() {
    const t = useTranslations("basket");
    const router = useRouter();

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBanned, setIsBanned] = useState(false);

    const [orderLoading, setOrderLoading] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState(false);

    useEffect(() => {
        (async () => {
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();
            if (!session?.user?.email) {
                router.push("/");
                return;
            }

            const userRes = await fetch("/api/user/me");
            const userData = await userRes.json();
            setIsBanned(userData.ban);

            const res = await fetch("/api/basket/items");
            const data = await res.json();
            setItems(data.items);
            setLoading(false);
        })();
    }, [router]);

    const updateItemQuantity = (id: string, newQty: number) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
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

    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    async function handleOrderSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setOrderLoading(true);
        setOrderError(null);
        setOrderSuccess(false);

        const formData = new FormData(e.currentTarget);
        const address = formData.get("address")?.toString() || "";
        const phone = formData.get("phone")?.toString() || "";

        try {
            const res = await fetch("/api/order/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address, phone, items }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Ошибка оформления заказа");
            }

            setOrderSuccess(true);
            setItems([]);
        } catch (error: any) {
            setOrderError(error.message);
        } finally {
            setOrderLoading(false);
        }
    }

    if (loading)
        return (
            <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="animate-spin w-10 h-10 text-gray-400" />
            </div>
        );

    return (
        <div className="p-4 md:p-10 text-white">
            <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
                ← {t("back")}
            </Link>
            <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

            {items.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-[30px] text-center">{t("empty")}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="relative w-full rounded-[8px] cursor-pointer">
                            <span className="w-full h-full rounded-[6px] flex flex-col justify-between p-[20px] bg-black text-white shadow-md">
                                <div className="w-full border-b-[1px] border-y-gray-700">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-[200px] object-contain mb-[10px]"
                                    />
                                </div>
                                <div className="flex flex-col justify-between min-h-[140px]">
                                    <h3 className="text-[20px] font-semibold mt-[5px] mb-[10px]">{item.title}</h3>
                                    <div className="flex items-center justify-between mt-[10px]">
                                        <p>{item.price * item.quantity}$</p>
                                        <div>
                                            <QuantityController
                                                itemId={item.id}
                                                quantity={item.quantity}
                                                onQuantityChange={(newQty) => updateItemQuantity(item.id, newQty)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        onClick={() => handleDelete(item.id)}
                                        className="mt-[10px] bg-red-500 hover:bg-red-700 cursor-pointer"
                                    >
                                        {t("remove")}
                                    </Button>
                                </div>
                            </span>
                            <span className="absolute inset-0 bg-gray-200 rounded-[8px] z-[-1]" />
                        </div>
                    ))}
                </div>
            )}

            {!isBanned && items.length > 0 && (
                <div className="fixed bottom-[40px] right-[20px] max-w-[400px] w-full">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="relative flex items-center rounded-[8px] justify-center w-full h-[50px] cursor-pointer hover:bg-orange-500">
                                <span className="rounded-[8px] p-[20px] flex items-center h-[50px] justify-center bg-[#ff90e8] text-black font-semibold !w-full transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
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
                            <form onSubmit={handleOrderSubmit} className="flex flex-col">
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    placeholder={t("address")}
                                    className="mb-4 p-2 rounded border border-gray-300 text-black"
                                />
                                <input
                                    type="text"
                                    name="phone"
                                    required
                                    placeholder="+998..."
                                    pattern="\+998\d{9}"
                                    className="mb-4 p-2 rounded border border-gray-300 text-black"
                                />
                                <p className="text-lg font-bold mt-4">
                                    {t("total")}: {totalPrice}$
                                </p>
                                <button
                                    type="submit"
                                    disabled={orderLoading}
                                    className="relative flex items-center rounded-[8px] justify-center w-full h-[40px] cursor-pointer hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="rounded-[8px] flex items-center h-[40px] justify-center bg-black text-white !w-full transform transition-all duration-150 ease-in-out hover:translate-x-[-0.3rem] hover:translate-y-[-0.3rem]">
                                        {orderLoading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                                        {t("confirm")}
                                    </span>
                                </button>
                                {orderError && (
                                    <p className="mt-2 text-red-500 font-semibold">{orderError}</p>
                                )}
                                {orderSuccess && (
                                    <p className="mt-2 text-green-500 font-semibold">{t("orderSuccess") || "Заказ оформлен!"}</p>
                                )}
                            </form>
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
    );
}