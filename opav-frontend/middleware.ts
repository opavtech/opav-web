import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./routing";
import { isSignatureImageRetired, transparentSignatureImage } from "./lib/signature-retirement";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/firma/FIR/img/")) {
    if (isSignatureImageRetired(request.nextUrl.pathname)) {
      return new NextResponse(
        request.method === "HEAD" ? null : transparentSignatureImage(),
        {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "no-store, max-age=0",
            "CDN-Cache-Control": "no-store",
            "Vercel-CDN-Cache-Control": "no-store",
          },
        },
      );
    }
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  // Aplicar a todas las rutas excepto API, assets, etc.
  matcher: ["/firma/FIR/img/:path*", "/((?!api|app|_next|_vercel|.*\\..*).*)"],
};
