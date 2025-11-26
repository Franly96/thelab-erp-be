export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    name: process.env.DB_NAME || 'thelab_erp',
    type: process.env.DB_TYPE || 'mysql',
    schema: process.env.DB_SCHEMA || 'public',
  },
});
