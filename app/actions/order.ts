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
        alert('Пожалуйста, заполните все поля корректно.');
        return;
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

    await prisma.order.create({
        data: {
            userId: user.id,
            address,
            phone,
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

}
