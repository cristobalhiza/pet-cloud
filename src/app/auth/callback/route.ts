import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "../../../services/GoogleAuth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    const errorUrl = new URL(req.nextUrl.origin);
    errorUrl.pathname = "/error";
    errorUrl.searchParams.set("message", "Missing authorization code");
    return NextResponse.redirect(errorUrl.toString());
  }

  try {
    const tokens = await getAccessToken(code);

    const redirectUrl = new URL(req.nextUrl.origin); 
    redirectUrl.pathname = "/"; 

    const response = NextResponse.redirect(redirectUrl.toString());
    if (tokens.access_token) {
      console.log("Access Token set in cookie:", tokens.access_token); 
      response.cookies.set("access_token", tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }
    if (tokens.refresh_token) {
      response.cookies.set("refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Error fetching tokens:", error);

    const errorUrl = new URL(req.nextUrl.origin);
    errorUrl.pathname = "/";
    errorUrl.searchParams.set("error", "auth_failed");

    return NextResponse.redirect(errorUrl.toString());
  }
}