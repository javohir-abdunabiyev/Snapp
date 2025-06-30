"use client";

import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";

type Order = {
    id: string;
    createdAt: string;
    status: string;
    address: string;
    phone: string;
    user: {
        name: string;
        email: string;
    };
    items: {
        id: string;
        title: string;
        imageUrl: string;
        price: number;
        quantity: number;
    }[];
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetch("/api/admin/orders")
            .then((res) => res.json())
            .then((data) => setOrders(data.orders));
    }, []);

    const updateStatus = async (orderId: string, status: string) => {
        await fetch("/api/admin/update-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, status }),
        });

        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status } : order
            )
        );
    };

    const t = useTranslations("adminOrders");

    const statuses = ["PENDING", "COLLECTING", "DELIVERING", "DELIVERED", "DECLINED"];

    return (
        <div className="p-10 text-white">
            {orders.length === 0 ? (
                <div className="text-center">
                    <div className="flex justify-center bg-white mt-[30px]">
                        <img src="/images/orderpagebg.svg" alt="" draggable="false" className="w-full" />
                    </div>
                    <p className="text-white text-[20px] font-semibold mt-[10px]">{t("dontHaveOrders")}</p>
                </div>
            ) : (

                <div className="space-y-6">
                    <h1 className="text-3xl font-bold mb-8">{t("allOrders")}</h1>
                    {orders.map((order) => (
                        <div key={order.id} className="border border-gray-700 rounded-lg p-5 bg-[#111]">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {t("orderFrom")} {new Date(order.createdAt).toLocaleString()}
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        {t("user")}: <span className="text-white font-medium">{order.user.name}</span> | Email: {order.user.email}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {t("address")}: {order.address} | {t("phone")}: {order.phone}
                                    </p>
                                </div>
                                <div className="relative flex items-center rounded-[8px] justify-center w-[200px] h-[40px]">
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className="appearance-none bg-white text-black font-semibold w-full h-full rounded-[8px] px-4 pr-8 
                                        focus:outline-none transform transition-all duration-150 ease-in-out"
                                    >
                                        {statuses.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-black">
                                        ▼
                                    </div>
                                </div>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="bg-black rounded p-3 border border-gray-700">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-full h-[150px] object-contain mb-2"
                                        />
                                        <h3 className="text-lg font-medium">{item.title}</h3>
                                        <p className="text-sm text-gray-300">{t("price")}: {item.price}$</p>
                                        <p className="text-sm text-gray-300">{t("quantity")}: {item.quantity}</p>
                                        <p className="text-sm text-white font-semibold">
                                            {t("total")}: {item.price * item.quantity}$
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="text-right mt-4 font-bold text-pink-400">
                                {t("Orderamount")}:{" "}
                                {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}$
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
