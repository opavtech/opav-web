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
  // Timeouts a nivel del servidor HTTP de Node. Sin esto, un request que se
  // cuelga (query lenta, pool agotado) queda vivo indefinidamente y acumula
  // sockets hasta que el proceso deja de aceptar conexiones — el patrón del
  // incidente (p99 degradado + connection dial timeout, resuelto con redeploy).
  http: {
    serverOptions: {
      // Mata cualquier request que supere 30s (Node default: sin límite).
      requestTimeout: env.int('HTTP_REQUEST_TIMEOUT', 30000),
      // Cierra conexiones keep-alive ociosas para no acumular sockets.
      keepAliveTimeout: env.int('HTTP_KEEP_ALIVE_TIMEOUT', 65000),
      headersTimeout: env.int('HTTP_HEADERS_TIMEOUT', 66000),
    },
  },
});