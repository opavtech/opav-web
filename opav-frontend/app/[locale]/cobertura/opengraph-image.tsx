import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isSpanish = locale === "es";

  const title = isSpanish ? "Cobertura Nacional" : "National Coverage";
  const subtitle = isSpanish
    ? "Proyectos OPAV & B&S en Colombia"
    : "OPAV & B&S projects in Colombia";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, #ffffff 0%, #f8fafc 40%, #ffffff 100%)",
        padding: 64,
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      }}
    >
      {/* Background accents */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 80px 80px, rgba(213,0,88,0.12) 0, transparent 55%), radial-gradient(circle at 1040px 120px, rgba(0,172,200,0.12) 0, transparent 55%), radial-gradient(circle at 960px 540px, rgba(213,0,88,0.10) 0, transparent 55%)",
        }}
      />

      {/* Grid dots */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #0f172a 2px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Header */}
      <div style={{ position: "relative", display: "flex", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderRadius: 999,
            border: "1px solid rgba(213,0,88,0.25)",
            background: "rgba(213,0,88,0.06)",
            color: "#a0003d",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#d50058",
              boxShadow: "0 0 0 6px rgba(213,0,88,0.12)",
            }}
          />
          OPAV & B&S
        </div>
      </div>

      {/* Main */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          marginTop: 40,
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            color: "#0f172a",
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.35,
            color: "#334155",
            maxWidth: 920,
          }}
        >
          {subtitle}
        </div>

        {/* Map-ish markers row */}
        <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
          {[
            { c: "#d50058", s: 18 },
            { c: "#d50058", s: 14 },
            { c: "#00acc8", s: 16 },
            { c: "#d50058", s: 12 },
            { c: "#00acc8", s: 10 },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                width: m.s * 4,
                height: m.s * 4,
                borderRadius: 999,
                background: m.c,
                border: "4px solid #ffffff",
                boxShadow:
                  "0 10px 30px rgba(15,23,42,0.15), 0 0 0 10px rgba(15,23,42,0.04)",
                opacity: 0.95,
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            color: "#475569",
            fontSize: 22,
          }}
        >
          <div>
            {isSpanish
              ? "Ciudades • Proyectos • Experiencia"
              : "Cities • Projects • Expertise"}
          </div>
          <div style={{ fontSize: 18, color: "#64748b" }}>
            {isSpanish ? "opav.com.co" : "opav.com.co"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderRadius: 16,
            background: "rgba(15,23,42,0.04)",
            border: "1px solid rgba(15,23,42,0.08)",
            color: "#0f172a",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#d50058" }}>●</span>
          <span style={{ color: "#00acc8" }}>●</span>
          <span style={{ marginLeft: 2 }}>
            {isSpanish ? "Cobertura Colombia" : "Coverage Colombia"}
          </span>
        </div>
      </div>
    </div>,
    size,
  );
}
