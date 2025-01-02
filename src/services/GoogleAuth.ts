import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export const getOAuth2Client = () => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET!;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

export const generateAuthUrl = () => {
  const oAuth2Client = getOAuth2Client();
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
};

export const getAccessToken = async (code: string) => {
  const oAuth2Client = getOAuth2Client();
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  return tokens;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
  const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET!;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const tokens = await response.json();
  return tokens.access_token;
};

export const getAccessTokenWithRefresh = async (refreshToken: string) => {
  const newAccessToken = await refreshAccessToken(refreshToken);
  localStorage.setItem("googleAccessToken", newAccessToken);
  return newAccessToken;
};