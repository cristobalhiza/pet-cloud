"use client";

import { useState, useEffect } from "react";

export default function AuthPage() {
    const [authUrl, setAuthUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuthUrl = async () => {
            const response = await fetch("/api/google/auth-url");
            const data = await response.json();
            setAuthUrl(data.authUrl);
        };

        fetchAuthUrl();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6">Autenticación con Google</h1>
            <button
                onClick={() => authUrl && (window.location.href = authUrl)}
                className="bg-accentPurple text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
                Autorizar con Google
            </button>
        </div>
    );
}
