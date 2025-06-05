import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

async function createUser() {
  const sereverSession = await getServerSession();
  const name: any = sereverSession?.user?.name
  const email: any = sereverSession?.user?.email

  if (sereverSession) {
    await prisma.user.create({
      data: {
        name,
        email,
      },
    });
  }
}

export default createUser;