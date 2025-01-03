"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function GoogleAuthButton() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Verificar autenticación y obtener información del usuario
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/google/user-info");
        if (response.ok) {
          const userInfo = await response.json();
          setUser(userInfo);
        } else {
          setUser(null); // Usuario no autenticado
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUser(null);
      }
    };

    fetchUserInfo();
  }, []);

  // Manejar autenticación
  const handleAuthClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/google/auth-url");
      if (!response.ok) {
        throw new Error("No se pudo obtener la URL de autenticación.");
      }

      const { authUrl } = await response.json();
      if (authUrl) {
        window.location.href = authUrl; // Redirigir al flujo de autenticación de Google
      } else {
        throw new Error("URL de autenticación no disponible.");
      }
    } catch (error) {
      console.error("Error durante la autenticación:", error);
      toast.error("Error al conectar con Google. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Manejar logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/google/logout", { method: "POST" });

      if (response.ok) {
        document.cookie = "access_token=; Max-Age=0; path=/;";
        setUser(null); // Reinicia el estado del usuario
        toast.success("Sesión cerrada correctamente.");
      } else {
        throw new Error("Error al cerrar sesión.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error inesperado al cerrar sesión.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded bg-gray-500 text-white opacity-50 cursor-not-allowed"
      >
        <img
          src="/google-icon.svg"
          alt="Google Icon"
          className="w-5 h-5"
        />
        Cargando...
      </button>
    );
  }

  if (user) {
    // Mostrar mensaje de bienvenida y botón de logout
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-800">Bienvenido, {user.name || user.email}!</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
        >
          <img
            src="/google-icon.svg"
            alt="Google Icon"
            className="w-5 h-5"
          />
          Logout
        </button>
      </div>
    );
  }

  // Mostrar botón de login si no hay usuario autenticado
  return (
    <button
      onClick={handleAuthClick}
      className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded shadow-md hover:bg-gray-100 transition"
    >
      <img
        src="/google-icon.svg"
        alt="Google Icon"
        className="w-5 h-5"
      />
      Autorizar con Google
    </button>
  );
}
