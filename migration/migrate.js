require('dotenv').config()

const path = require('path')

require('sql-migrations').run({
    migrationsDir: path.resolve(__dirname, 'sql'),
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    db: process.env.DB_NAME,
    adapter: 'pg',
})
