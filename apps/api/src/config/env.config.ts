export default () => ({
  app: {
    name: process.env.APP_NAME || 'doevida-api',
    port: parseInt(process.env.PORT || '3001', 10),
    env: process.env.NODE_ENV || 'production',
    allowedOrigins: process.env.ALLOWED_ORIGINS || '',
  },
  swagger: {
    title: process.env.SWAGGER_TITLE || 'Doe Vida API',
    description:
      process.env.SWAGGER_DESCRIPTION ||
      'API para gerenciamento de doações de sangue e cadastro de doadores.',
    version: process.env.SWAGGER_VERSION || '1.0',
    path: process.env.SWAGGER_PATH || 'api/docs',
  },
  database: {
    postgres: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5433', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_DATABASE,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
    },
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES || '1d',
  },
});
