import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value || null;

    // Защита /admin/dashboard
    if (req.nextUrl.pathname.startsWith("/admin/dashboard/")) {
        if (!token) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
        try {
            jwt.verify(token, JWT_SECRET);
        } catch {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
    }

    // Если авторизован и пытается зайти на /admin — редиректим на /admin/dashboard
    if (req.nextUrl.pathname === "/admin" && token) {
        try {
            jwt.verify(token, JWT_SECRET);
            return NextResponse.redirect(new URL("/admin/dashboard/", req.url));
        } catch {
            // invalid token — показываем страницу логина
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/dashboard/"],
};
