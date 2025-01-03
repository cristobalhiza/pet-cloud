import { createGoogleCalendarEventDto } from "../../../../dto/googleCalendarEventDto"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Request body received in add-event API:", body);

        const { accessToken, title, date, daysInterval, description } = body;

        if (!accessToken || !title || !date) {
            return NextResponse.json(
                { error: "Missing required fields: accessToken, title, or date" },
                { status: 400 }
            );
        }

        const startDate = new Date(date);
        const endDate = daysInterval
        ? new Date(startDate.getTime() + daysInterval * 24 * 60 * 60 * 1000)
        : startDate;
    

        const eventDto = createGoogleCalendarEventDto(
            title,
            description,
            endDate,
            endDate,
            true // Cambiar a false si no es un evento de día completo
        );

        console.log("Sending Event DTO to Google Calendar:", JSON.stringify(eventDto, null, 2));

        const response = await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventDto),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Error creating event in Google Calendar:", error);
            return NextResponse.json({ error }, { status: response.status });
        }

        // Lee el cuerpo de la respuesta solo una vez
        const event = await response.json();
        console.log("Google Calendar API Response:", event);

        return NextResponse.json(event);
    } catch (error) {
        console.error("Unexpected error in add-event API:", error);

        // Asegúrate de no volver a consumir el cuerpo de la respuesta en este bloque catch
        return NextResponse.json(
            { error: "An unexpected error occurred while creating the event" },
            { status: 500 }
        );
    }
}

