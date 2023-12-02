export default () => ({
  clientUrl: process.env.CLIENT_URL,
  port: parseInt(process.env.PORT ?? '8080', 10),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
});
