import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const accessToken = req.cookies.get("access_token")?.value;

    console.log("Access Token in user-info:", accessToken);

    if (!accessToken) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const validationResponse = await fetch(
            `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
        );
        const validationData = await validationResponse.json();
        console.log("Token validation response:", validationData);

        if (!validationResponse.ok) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }


        const response = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error fetching user info:", errorText);
            return NextResponse.json({ error: "Failed to fetch user info" }, { status: response.status });
        }

        const userInfo = await response.json();
        return NextResponse.json(userInfo);
    } catch (error) {
        console.error("Error fetching user info:", error);
        return NextResponse.json({ error: "Failed to fetch user info" }, { status: 500 });
    }
}
