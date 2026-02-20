import createMiddleware from "next-intl/middleware";
import { routing } from "./routing";

export default createMiddleware(routing);

export const config = {
  // Aplicar a todas las rutas excepto API, assets, etc.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
