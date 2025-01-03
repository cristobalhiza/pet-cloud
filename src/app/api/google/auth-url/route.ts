import { generateAuthUrl } from "@/services/GoogleAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
      const authUrl = generateAuthUrl();
      if (!authUrl) throw new Error("No se pudo generar la URL de autenticación.");
      return NextResponse.json({ authUrl });
    } catch (error) {
      console.error("Error generating auth URL:", error);
      return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 });
    }
  }
  
