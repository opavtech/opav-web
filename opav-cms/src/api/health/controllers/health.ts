/**
 * Health check que verifica disponibilidad REAL de la app, no solo que el
 * proceso responda. Ejecuta un `SELECT 1` contra Postgres: si el pool de
 * conexiones está agotado o la DB no responde, el check falla (503) en vez
 * de mentir con un 200 mientras el sitio está degradado — el patrón del
 * incidente que motivó esto. Pensado para monitoreo externo (Better Stack).
 *
 * Endpoint: GET /api/health  (público, sin auth)
 */
export default {
  async check(ctx) {
    try {
      // Query trivial: valida que se pueda adquirir una conexión del pool y
      // que Postgres responda. Con timeout implícito de acquireConnectionTimeout.
      await strapi.db.connection.raw('SELECT 1');
      ctx.body = { status: 'ok', database: 'up' };
    } catch (error) {
      strapi.log.error('[health] database check failed', error);
      ctx.status = 503;
      ctx.body = { status: 'error', database: 'down' };
    }
  },
};
