import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Некорректные данные" });
        }

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return NextResponse.json({ success: false, message: "Администратор не найден" });
        }

        if (admin.password !== password) {
            return NextResponse.json({ success: false, message: "Неверный пароль" });
        }

        const token = jwt.sign({ email: admin.email }, JWT_SECRET, { expiresIn: "1h" });

        const response = NextResponse.json({ success: true });
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60,
            sameSite: "lax",
            secure: false,
        });

        return response;
    } catch (error) {
        console.error("Ошибка в API /admin/login:", error);
        return NextResponse.json({ success: false, message: "Ошибка сервера" });
    }
}
