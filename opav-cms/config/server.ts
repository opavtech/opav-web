export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL'),
  proxy: {
    koa: true,
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
  // Timeout a nivel del servidor HTTP de Node. Sin esto, un request colgado
  // (query lenta, pool agotado) vive indefinidamente acumulando sockets hasta
  // que el proceso deja de aceptar conexiones — el patrón del incidente.
  // NOTA: keepAliveTimeout/headersTimeout se dejan fuera a propósito; se
  // sospecha que interactuaban mal con el proxy de Railway y crashearon el
  // deploy anterior. Solo requestTimeout, que es lo que mata el request colgado.
  http: {
    serverOptions: {
      requestTimeout: env.int('HTTP_REQUEST_TIMEOUT', 30000),
    },
  },
});