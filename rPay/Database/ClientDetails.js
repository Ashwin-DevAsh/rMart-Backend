module.exports = {
  host: process.env.RPAY_POSTGRES_URL,
  port: 5432,
  user: process.env.RPAY_POSTGRES_USER,
  password: process.env.RPAY_POSTGRES_PASSWORD,
  database: process.env.RPAY_POSTGRES_DATABASE,
};
