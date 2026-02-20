import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isSpanish = locale === "es";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, #d50058 0%, #a0003d 45%, #00acc8 110%)",
        padding: 64,
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.14,
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 2px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.28)",
          background: "rgba(255,255,255,0.12)",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#ffffff",
            boxShadow: "0 0 0 6px rgba(255,255,255,0.18)",
          }}
        />
        OPAV & B&S
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -1,
          }}
        >
          {isSpanish ? "Cobertura Nacional" : "National Coverage"}
        </div>
        <div
          style={{
            fontSize: 30,
            lineHeight: 1.25,
            opacity: 0.92,
            maxWidth: 980,
          }}
        >
          {isSpanish
            ? "Presencia estratégica en las principales ciudades de Colombia"
            : "Strategic presence in Colombia's main cities"}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 20,
          opacity: 0.92,
        }}
      >
        <div>
          {isSpanish
            ? "Ciudades • Proyectos • Ingeniería"
            : "Cities • Projects • Engineering"}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#ffffff",
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#ffffff",
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#ffffff",
            }}
          />
        </div>
      </div>
    </div>,
    size,
  );
}
