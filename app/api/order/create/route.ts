import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ message: "Неавторизован" }, { status: 401 });
        }

        const { address, phone, items } = await req.json();

        if (!address || !phone || !items || !Array.isArray(items)) {
            return NextResponse.json({ message: "Неверные данные заказа" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
        }

        const totalPrice = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                address,
                phone,
                total: totalPrice,
                items: {
                    create: items.map((item: any) => ({
                        title: item.title,
                        imageUrl: item.imageUrl,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                },
            },
        });

        // Очищаем корзину пользователя после заказа
        const basket = await prisma.basket.findUnique({
            where: { userId: user.id },
        });

        if (basket) {
            await prisma.basketItem.deleteMany({
                where: { basketId: basket.id },
            });
        }

        return NextResponse.json({ message: "OK", orderId: order.id });
    } catch (err: any) {
        console.error("Ошибка создания заказа:", err);
        return NextResponse.json({ message: err.message || "Ошибка сервера" }, { status: 500 });
    }
}
