module.exports = {
  databaseUrl: {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
  },

  migrationsTable: 'pgmigrations',

  dir: 'migrations',

  direction: 'up',

  count: Infinity,
};