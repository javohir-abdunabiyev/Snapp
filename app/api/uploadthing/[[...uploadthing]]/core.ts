import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import prisma from "@/lib/prisma";
import { parse } from "cookie";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .middleware(async ({ req }) => {
            const cookieHeader = req.headers.get("cookie");
            if (!cookieHeader) throw new UploadThingError("No cookies");

            const cookies = parse(cookieHeader);
            const email = cookies["email"];
            if (!email) throw new UploadThingError("No email in cookies");

            const admin = await prisma.admin.findUnique({ where: { email } });
            if (!admin) throw new UploadThingError("Admin not found");

            return { userId: admin.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("✅ Upload complete for:", metadata.userId);
            console.log("📦 File URL:", file.url);
            return { uploadedBy: metadata.userId, url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
