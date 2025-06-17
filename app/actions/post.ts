'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const price = parseInt(formData.get('price') as string, 10);

    const cookieStore: any = cookies();
    const email = cookieStore.get('email')?.value;


    if (!email) throw new Error('Email не найден в куках');

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) throw new Error('Админ не найден');

    await prisma.post.create({
        data: {
            title,
            content,
            imageUrl,
            price,
            published: true,
            authorId: admin.id,
        },
    });

    revalidatePath('/admin/dashboard/posts');
    redirect('/admin/dashboard/posts');
}
