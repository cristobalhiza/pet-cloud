"use client";

export default function Footer() {
  return (
    <footer className="mt-10 p-6 text-center bg-dark text-lightGray border-t border-lightGray">
      <p className="mb-4 text-sm sm:text-base">
        Pet Cloud 2025 | Desarrollado por{" "}
        <a
          href="https://cristobalhiza.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange hover:underline"
        >
          Cristobal Hiza
        </a>
      </p>
      <p className="mb-4 font-semibold text-sm sm:text-base">
        ¿Te gustaría utilizar esta app o desarrollar algún otro proyecto?{" "}
        <span className="text-orange">¡Contáctame!</span>
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
        <p>
          <a
            href="mailto:contacto@cristobalhiza.com"
            className="text-orange hover:underline"
          >
            contacto@cristobalhiza.com
          </a>
        </p>
        <p>
          <a
            href="tel:+56989871625"
            className="text-orange hover:underline"
          >
            +56 989871625
          </a>
        </p>
        <p>
          <a
            href="https://cristobalhiza.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange hover:underline"
          >
            cristobalhiza.com
          </a>
        </p>
      </div>
    </footer>
  );
}
