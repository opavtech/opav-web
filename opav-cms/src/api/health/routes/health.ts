export default {
  routes: [
    {
      method: 'GET',
      path: '/health',
      handler: 'health.check',
      config: {
        // Público: el monitor de uptime no envía token de autenticación.
        auth: false,
      },
    },
  ],
};
