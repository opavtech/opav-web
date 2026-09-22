// Fechas de Colombia (UTC-5). Los originales permanecen en public/firma/FIR/img.
export const signatureRetirement: Record<string, string> = {
  "linkedin.png": "2026-09-21T00:00:00-05:00",
  "red.png": "2026-09-21T00:00:00-05:00",
  "red_2.png": "2026-09-21T00:00:00-05:00",
  "bl.png": "2026-09-22T00:00:00-05:00",
  "House.png": "2026-09-22T00:00:00-05:00",
  "ubicacion.png": "2026-09-22T00:00:00-05:00",
  "tel.png": "2026-09-23T00:00:00-05:00",
  "tel_2.png": "2026-09-23T00:00:00-05:00",
  "mail.png": "2026-09-24T00:00:00-05:00",
  "mail_2.png": "2026-09-24T00:00:00-05:00",
  "linea.png": "2026-09-25T00:00:00-05:00",
  "linea_2.png": "2026-09-25T00:00:00-05:00",
  "logo.png": "2026-09-26T00:00:00-05:00",
  "BS.png": "2026-09-26T00:00:00-05:00",
};

export function isSignatureImageRetired(pathname: string, now = Date.now()) {
  const prefix = "/firma/FIR/img/";
  if (!pathname.startsWith(prefix)) return false;
  const filename = pathname.slice(prefix.length);
  if (!Object.hasOwn(signatureRetirement, filename)) return false;
  return now >= Date.parse(signatureRetirement[filename]);
}

// PNG transparente 1x1, servido como archivo binario (no como data URI).
export function transparentSignatureImage() {
  return Uint8Array.from(
    atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAarVyFEAAAAASUVORK5CYII="),
    (character) => character.charCodeAt(0),
  );
}
