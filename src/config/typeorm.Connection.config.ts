import pg, { Pool, Client } from 'pg';
import { connectionDB, jwt_secret, expires_in } from './configVariables';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Create a pool of database connections.
 * A pool allows the app to reuse connections instead of creating new ones each time.
 */
const pool: Pool = new Pool({
  connectionString: connectionDB,
});

/**
 * Test function for the connection pool.
 * It runs a simple query (SELECT NOW) to check if the database works.
 */
async function testPool() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Pool query result:', res.rows);
  } catch (err) {
    console.error('Pool query error:', err);
  } finally {
    // Close the pool when the test is done
    await pool.end();
  }
}

/**
 * Create a single client connection to the database.
 * This connects directly without using the pool.
 */
const client: Client = new Client({
  connectionString: connectionDB,
});

/**
 * Test function for the single client.
 * It also runs a simple query to check if the connection works.
 */
async function testClient() {
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Client query result:', res.rows);
  } catch (err) {
    console.error('Client query error:', err);
  } finally {
    // Close the client when the test is done
    await client.end();
  }
}

/**
 * TypeORM configuration for NestJS.
 * It defines how the app connects to the PostgreSQL database.
 * - `url`: the database connection string.
 * - `autoLoadEntities`: automatically load all entities.
 * - `synchronize`: if true, it updates the database schema automatically.
 * - `logging`: shows SQL logs in the console.
 * - `ssl`: enables SSL if it is set in environment variables.
 */
export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: connectionDB,
  autoLoadEntities: true,
  synchronize: String(process.env.DB_SYNC ?? 'true').toLowerCase() === 'true',
  logging: String(process.env.DB_LOGGING ?? 'true').toLowerCase() === 'true',
  ...(String(process.env.DB_SSL ?? 'false').toLowerCase() === 'true'
    ? {
        ssl: {
          rejectUnauthorized:
            String(
              process.env.DB_SSL_REJECT_UNAUTHORIZED ?? 'false',
            ).toLowerCase() === 'true',
        },
      }
    : {}),
};

/**
 * Run the test functions to make sure the database connection works.
 */
(async () => {
  await testPool();
  await testClient();
})();
