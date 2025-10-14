import pg, { Pool, Client } from 'pg';
import { connectionDB, jwt_secret, expires_in } from './configVariables'; 
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const pool: Pool = new Pool({
  connectionString: connectionDB,
});

async function testPool() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Pool query result:', res.rows);
  } catch (err) {
    console.error('Pool query error:', err);
  } finally {
    await pool.end();
  }
}

const client: Client = new Client({
  connectionString: connectionDB,
});

async function testClient() {
  try {
    await client.connect();
    const res = await client.query('SELECT NOW()');
    console.log('Client query result:', res.rows);
  } catch (err) {
    console.error('Client query error:', err);
  } finally {
    await client.end();
  }
}

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
            String(process.env.DB_SSL_REJECT_UNAUTHORIZED ?? 'false').toLowerCase() ===
            'true',
        },
      }
    : {}),
};

(async () => {
  await testPool();
  await testClient();
})();
