import prisma from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user?.email) return false;

            try {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                    include: { basket: true },
                });

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name || "",
                            basket: { create: {} },
                        },
                    });
                } else if (!existingUser.basket) {
                    await prisma.basket.create({
                        data: { userId: existingUser.id },
                    });
                }

                return true;
            } catch (err) {
                console.error(err);
                return false;
            }
        },
    },
};
