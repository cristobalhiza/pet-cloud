import fetch from "node-fetch";

const endpoints = [
    "http://localhost:3000/api/google/auth-url",
    "http://localhost:3000/api/google/logout",
];

// Función para verificar si el servidor está listo
const checkServerReady = async (url) => {
    for (let i = 0; i < 10; i++) {
        try {
            await fetch(url, { method: "HEAD" });
            console.log("Server is ready.");
            return true;
        } catch (error) {
            console.log("Waiting for server to start...");
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera 1 segundo
        }
    }
    throw new Error("Server did not start in time.");
};

(async () => {
    try {
        // Asegúrate de que el servidor esté listo
        await checkServerReady("http://localhost:3000");

        console.log("Precompiling routes...");
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint);
                console.log(`Precompiled ${endpoint}: ${response.status}`);
            } catch (error) {
                console.error(`Failed to precompile ${endpoint}:`, error);
            }
        }
    } catch (error) {
        console.error("Error waiting for server to start:", error);
    }
})();
