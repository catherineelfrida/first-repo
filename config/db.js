const { Pool } = require('pg')
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'bank',
  user: 'postgres',
  password: 'admin',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

module.exports = pool
