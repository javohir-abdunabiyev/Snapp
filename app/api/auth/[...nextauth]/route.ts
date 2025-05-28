import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],

    callbacks: {
        async signIn({ user }: { user: { email?: any; name?: any } }) {
            console.log("signIn callback user:", user);

            if (!user?.email) {
                console.log("No email, denying access");
                return false;
            }

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
                    console.log("Created new user and basket");
                } else if (!existingUser.basket) {
                    await prisma.basket.create({
                        data: { userId: existingUser.id },
                    });
                    console.log("Created basket for existing user");
                }

                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
