import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function OrdersPage() {
    const session = await getServerSession();
    const t = await getTranslations("orders");

    if (!session?.user?.email) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            orders: {
                include: {
                    items: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    const orders = user?.orders ?? [];

    return (
        <div className="p-10 text-white">
            <Link
                href="/"
                className="inline-block mb-6 text-sm text-pink-500 hover:text-pink-600 transition"
            >
                ← {t("back")}
            </Link>
            <h1 className="text-3xl font-bold mb-6">
                {t("title")}
            </h1>

            {orders.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                    <p className="text-[30px]">
                        {t("empty")}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="border border-gray-600 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-semibold">{t("orderFrom")} {new Date(order.createdAt).toLocaleDateString()}</h2>
                                <span className="text-sm font-bold text-gray-400">{t("orderStatus")}: <span className="text-[#ff90e8]">{order.status}</span></span>
                            </div>
                            <p className="mb-[5px]">{t("deliveryNote")}</p>
                            <p className="mb-2 text-sm text-gray-300">{t("address")}: {order.address}</p>
                            <p className="mb-4 text-sm text-gray-300">{t("phone")}: {order.phone}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                                        <p className="text-sm text-white font-semibold">{t("total")}: {item.price * item.quantity}$</p>
                                    </div>
                                ))}
                            </div>

                            <div className="text-right mt-4 font-bold text-pink-400">
                                {t("totalAmount")}: {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}$
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
