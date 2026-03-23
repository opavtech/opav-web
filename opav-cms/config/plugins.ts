export default ({ env }) => ({
  i18n: {
    enabled: true,
    config: {
      locales: ['es', 'en'],
      defaultLocale: 'es',
    },
  },

  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      sizeLimit: 250 * 1024 * 1024,
    },
  },
});
