export default () => ({
  // Internacionalización
  i18n: {
    enabled: true,
    config: {
      locales: ['es', 'en'],
      defaultLocale: 'es',
    },
  },
  
  // Configuración de upload
  upload: {
    config: {
      sizeLimit: 250 * 1024 * 1024, // 250MB
    },
  },
});