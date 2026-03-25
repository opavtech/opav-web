"use client";

import { useEffect, useState } from "react";

export default function DebugClientPage() {
  const [env, setEnv] = useState<Record<string, string | null>>({});

  useEffect(() => {
    setEnv({
      NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL ?? null,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    });

    console.log("CLIENT ENV", {
      NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h2>Server (SSR inline):</h2>
      <pre>
        {JSON.stringify(
          {
            NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL ?? null,
            NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? null,
          },
          null,
          2
        )}
      </pre>
      <h2>Client (after hydration):</h2>
      <pre>{JSON.stringify(env, null, 2)}</pre>
    </div>
  );
}
