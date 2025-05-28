import prisma from "@/lib/prisma";
import { useSession } from "next-auth/react";

async function createUser() {
  const { data: session } = useSession();
  const name: any = session?.user?.name
  const email: any = session?.user?.email

  if (session) {
    await prisma.user.create({
      data: {
        name,
        email,
      },
    });
  }
}

export default createUser;