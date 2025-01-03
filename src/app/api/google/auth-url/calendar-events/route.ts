import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const accessToken = req.headers.get("Authorization")?.split("Bearer ")[1];

    if (!accessToken) {
        return NextResponse.json({ error: "Missing access token" }, { status: 401 });
    }

    try {
        const response = await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json({ error }, { status: response.status });
        }

        const events = await response.json();
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}
