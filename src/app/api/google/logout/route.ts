// src/app/api/google/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logout successful" });

    // Elimina la cookie en el backend
    response.cookies.set("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });

    return response;
}
