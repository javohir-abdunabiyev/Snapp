'use server'

import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createOrder(formData: FormData) {
    const session = await getServerSession();
    if (!session?.user?.email) {
        redirect('/');
    }

    const address = formData.get('address')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();

    const uzbekPhoneRegex = /^\+998\d{9}$/;
    if (!address || !phone || !uzbekPhoneRegex.test(phone)) {
        // Эта проверка будет работать только в браузере, но здесь сервер. Лучше использовать redirect или throw error
        redirect('/basket?error=invalid');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            basket: {
                include: {
                    items: true,
                },
            },
        },
    });

    if (!user || !user.basket || user.basket.items.length === 0) {
        redirect('/basket?error=empty');
    }

    const total = user.basket.items.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    await prisma.order.create({
        data: {
            userId: user.id,
            address,
            phone,
            total,
            items: {
                create: user.basket.items.map((item) => ({
                    title: item.title,
                    imageUrl: item.imageUrl,
                    price: item.price,
                    quantity: item.quantity,
                })),
            },
        },
    });

    await prisma.basketItem.deleteMany({
        where: {
            basketId: user.basket.id,
        },
    });

    redirect('/orders');

}
