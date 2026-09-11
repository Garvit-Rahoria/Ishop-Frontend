import { NextResponse } from "next/server";

/** Mirror API JWT onto the Next.js origin so SSR + cookies() work. */
export async function POST(request) {
    try {
        const body = await request.json();
        const token = body?.token;

        if (!token || typeof token !== "string") {
            return NextResponse.json(
                { success: false, message: "token required" },
                { status: 400 }
            );
        }

        const res = NextResponse.json({ success: true });
        res.cookies.set("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60,
        });
        return res;
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid request" },
            { status: 400 }
        );
    }
}

export async function DELETE() {
    const res = NextResponse.json({ success: true });
    res.cookies.set("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
    return res;
}
