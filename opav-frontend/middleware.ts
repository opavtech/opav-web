import createMiddleware from 'next-intl/middleware';
import {locales} from './i18n';

export default createMiddleware({
  // Idiomas soportados
  locales: locales,
  
  // Idioma por defecto
  defaultLocale: 'es',
  
  // Detectar idioma del navegador
  localeDetection: true
});

export const config = {
  // Aplicar a todas las rutas excepto API, assets, etc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};