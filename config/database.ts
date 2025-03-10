import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

/*
host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        */
const dbConfig = defineConfig({
  prettyPrintDebugQueries: true,
  connection: 'postgres',

  connections: {
    postgres: {
      client: 'pg',
      connection: {
        connectionString: env.get('CONNECTION_STRING'),
        ssl: env.get('SSL') === 'true' ? true : false,
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: true,
    },
  },
})

export default dbConfig
