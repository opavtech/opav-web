import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Página no encontrada | OPAV SAS",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/images/logos/opav-logo.svg",
  },
};

export default function RootNotFound() {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: "sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#fff",
          color: "#111",
        }}
      >
        <h1 style={{ fontSize: "6rem", margin: 0, color: "#C42959" }}>404</h1>
        <p style={{ fontSize: "1.25rem", marginTop: "1rem" }}>
          Página no encontrada
        </p>
        <Link
          href="/es"
          style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#C42959",
            color: "#fff",
            borderRadius: "0.5rem",
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>
      </body>
    </html>
  );
}
