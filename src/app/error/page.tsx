"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Error de Autenticación</h1>
      <p className="mt-4">{message || "Algo salió mal durante la autenticación."}</p>
    </div>
  );
}
