import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your_super_secret_key");

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;

    if (req.nextUrl.pathname.startsWith("/admin/dashboard")) {
        if (!token) {
            return NextResponse.redirect(new URL("/admin", req.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            const email = payload.email;

            if (!email) {
                return NextResponse.redirect(new URL("/admin", req.url));
            }

            const emailCookie = req.cookies.get("email")?.value;

            if (!emailCookie) {
                const response = NextResponse.next();

                response.cookies.set('email', String(email), {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24 * 7, // 7 дней
                });

                return response;
            }

            return NextResponse.next();

        } catch (error) {
            console.error("JWT verification error:", error);
            return NextResponse.redirect(new URL("/admin", req.url));
        }
    }

    return NextResponse.next();
}
