# Pet Cloud 🐾 | Administración de mascotas

**Pet Cloud** es una aplicación de administración de mascotas y eventos diseñada para que los usuarios puedan registrar mascotas, gestionar eventos relacionados y sincronizar dichos eventos con Google Calendar. Estos pueden ser vacunas, desparasitarios, medicamentos, visitas al veterinario, etc. La integración con Google Calendar sirve como recordatorio de la fecha en el que hay que estar atento a un evento determinado.

---

## **Índice**
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribución](#contribución)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## **Características**
- **Autenticación con Google**: Inicia sesión y gestiona eventos vinculados a tu cuenta de Google.
- **Gestión de Mascotas**: Agrega, edita y elimina mascotas fácilmente.
- **Gestión de Eventos**: Crea y administra eventos relacionados con tus mascotas.
- **Sincronización con Google Calendar**: Sincroniza los eventos de tus mascotas directamente con tu calendario de Google.
- **Notificaciones**: Notificaciones visuales mediante `react-toastify`.
- **Estilo moderno**: Interfaz responsive y personalizable con `TailwindCSS` y `Primer React`.

---

## **Tecnologías Utilizadas**
- **Framework**: [Next.js](https://nextjs.org/) 15.1.0
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) 5.7.2
- **Estado Global**: [Zustand](https://github.com/pmndrs/zustand)
- **Autenticación**: [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- **Base de Datos**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Estilos**: [TailwindCSS](https://tailwindcss.com/) y [Primer React](https://primer.style/react)
- **Gestión de Eventos**: `node-fetch`.
- **Linter**: ESLint con configuración para Next.js y TypeScript

---

## **Instalación**

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/pet-cloud.git
   cd pet-cloud

    Instala las dependencias usando pnpm:

pnpm install

Crea un archivo .env.local con las siguientes variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY: Clave de API de Firebase.
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: Dominio de autenticación de Firebase.
NEXT_PUBLIC_FIREBASE_PROJECT_ID: ID del proyecto en Firebase.
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: Bucket de almacenamiento de Firebase.
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ID del remitente de mensajes de Firebase.
NEXT_PUBLIC_FIREBASE_APP_ID: ID de la aplicación en Firebase.
NEXT_PUBLIC_REDIRECT_URI: URI de redireccionamiento para la autenticación de Google.
NEXT_PUBLIC_CLIENT_ID: ID del cliente de Google OAuth.
NEXT_PUBLIC_CLIENT_SECRET: Secreto del cliente de Google OAuth.
```
Inicia el servidor de desarrollo:

    pnpm run dev

La aplicación estará disponible en http://localhost:3000.
Uso

    Inicio de Sesión: Haz clic en el botón "Autorizar con Google" para iniciar sesión.
    Gestión de Mascotas:
        Agrega nuevas mascotas utilizando el formulario.
        Edita o elimina mascotas existentes.
    Gestión de Eventos:
        Crea nuevos eventos asociados a una mascota.
        Elige si deseas sincronizar los eventos con Google Calendar manualmente.

Scripts Disponibles

    pnpm run dev: Inicia el servidor de desarrollo.
    pnpm run build: Genera una compilación de producción optimizada.
    pnpm run start: Inicia el servidor con la compilación de producción.
    pnpm run lint: Ejecuta ESLint para verificar problemas de código.

Estructura del Proyecto
```
admin-perrita/
├── public/                         # Archivos públicos (imágenes y otros assets)
├── src/
│   ├── app/                        # Directorios de páginas y APIs
│   │   ├── api/                    # Rutas API
│   │   ├── auth/                   # Rutas de autenticación
│   │   ├── layout.tsx              # Layout principal
│   │   └── page.tsx                # Página principal
│   ├── components/                 # Componentes reutilizables
│   ├── context/                    # Contexto global (PetContext)
│   ├── dto/                        # Data Transfer Objects (DTO)
│   ├── hooks/                      # Hooks personalizados
│   ├── services/                   # Servicios de Firebase y Google Auth
│   ├── store/                      # Estado global (Zustand)
│   └── types/                      # Tipos TypeScript
├── .env.local                      # Variables de entorno
├── package.json                    # Información del proyecto y scripts
├── pnpm-lock.yaml                  # Bloqueo de dependencias
└── README.md                       # Documentación del proyecto
```
Contribución

¡Las contribuciones son bienvenidas! Si deseas contribuir:

    Haz un fork del repositorio.
    Crea una nueva rama (git checkout -b feature/nueva-funcionalidad).
    Realiza tus cambios y haz commit (git commit -m 'Añadir nueva funcionalidad').
    Haz push a la rama (git push origin feature/nueva-funcionalidad).
    Abre un Pull Request.

Licencia

Este proyecto está licenciado bajo la MIT License.
Contacto

¿Te gustaría utilizar esta app o desarrollar algún otro proyecto?
¡Contáctame!

    Email: contacto@cristobalhiza.com
    Teléfono: +56 9 8987 1625
    Web: cristobalhiza.com
