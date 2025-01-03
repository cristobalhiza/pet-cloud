export interface GoogleCalendarEventDTO {
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string; 
    date?: string; 
    timeZone?: string;
  };
  reminders?: {
    useDefault: boolean; 
    overrides?: { method: string; minutes: number }[]; 
  };
}



export const createGoogleCalendarEventDto = (
  title: string,
  description: string | undefined,
  startDate: Date,
  endDate: Date,
  isAllDay: boolean
): GoogleCalendarEventDTO => {
  if (isAllDay) {
    return {
      summary: title,
      description,
      start: { date: startDate.toISOString().split("T")[0] },
      end: { date: endDate.toISOString().split("T")[0] }, 
    };
  } else {
    return {
      summary: title,
      description,
      start: {
        dateTime: startDate.toISOString(), 
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "America/Los_Angeles",
      },
    };
  }
};



