"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function GoogleAuthButton() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/google/user-info");
        if (response.ok) {
          const userInfo = await response.json();
          setUser(userInfo);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUser(null);
      }
    };

    fetchUserInfo();
  }, []);

  const handleAuthClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/google/auth-url");
      if (!response.ok) {
        throw new Error("No se pudo obtener la URL de autenticación.");
      }

      const { authUrl } = await response.json();
      if (authUrl) {
        window.location.href = authUrl;
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

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/google/logout", { method: "POST" });

      if (response.ok) {
        document.cookie = "access_token=; Max-Age=0; path=/;";
        setUser(null);
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
        <Image
          src="/google-icon.svg"
          alt="Google Icon"
          width={20}
          height={20} 
        />
        Cargando...
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-lightGray">Bienvenido, {user.name || user.email}!</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
        >
          <Image
            src="/google-icon.svg"
            alt="Google Icon"
            width={20}
            height={20} 
          />
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="">
    <button
      onClick={handleAuthClick}
      className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded shadow-md hover:bg-gray-100 transition max-w-60"
    >
      <Image
        src="/google-icon.svg"
        alt="Google Icon"
        width={20}
        height={20} 
      />
      Autorizar con Google
    </button>
    </div>
  );
}
