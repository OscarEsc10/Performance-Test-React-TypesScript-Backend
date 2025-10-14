
import * as dotenv from 'dotenv';
dotenv.config();
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const usingUrl = !!process.env.DB_CONNECTION;
if (usingUrl) {
  const url = process.env.DB_CONNECTION as string;
  if (!/^postgres(ql)?:\/\//i.test(url)) {
    throw new Error(
      "Invalid DB_CONNECTION: must start with 'postgres://' or 'postgresql://'.",
    );
  }
  try {
    // Validate that it's a well-formed URL (host, protocol, etc.)
    // eslint-disable-next-line no-new
    const u = new URL(url);
    if (!u.hostname) throw new Error('missing hostname');
    if (!u.pathname || u.pathname === '/') throw new Error('missing database name');
    if (!u.username) {
      // eslint-disable-next-line no-console
      console.warn('[DB] DB_CONNECTION URL has no username.');
    }
    const safe = `${u.protocol}//${u.username || '<no-user>'}@${u.hostname}:${
      u.port || '5432'
    }${u.pathname}`;
    // eslint-disable-next-line no-console
    console.info(`[DB] Using DB_CONNECTION URL -> ${safe}`);
  } catch {
    throw new Error('Invalid DB_CONNECTION: not a valid URL.');
  }
} else {
  throw new Error(
    'DB_CONNECTION is required. Please set a Postgres URL in your .env file.',
  );
}

function buildConnectionSummary() {
  try {
    const u = new URL(process.env.DB_CONNECTION as string);
    return `${u.protocol}//${u.username || '<no-user>'}@${u.hostname}:${
      u.port || '5432'
    }${u.pathname}`;
  } catch {
    return '<invalid-url>';
  }
}

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DB_CONNECTION as string,
  autoLoadEntities: true,
  synchronize:
    String(process.env.DB_SYNC ?? 'true').toLowerCase() === 'true',
  logging:
    String(process.env.DB_LOGGING ?? 'true').toLowerCase() === 'true',
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

// Final startup summary (static and safe to print before actual connection)
// eslint-disable-next-line no-console
console.info(
  `[DB] Config -> sync=${String(process.env.DB_SYNC ?? 'true').toLowerCase()} ` +
    `logging=${String(process.env.DB_LOGGING ?? 'true').toLowerCase()} ` +
    `ssl=${String(process.env.DB_SSL ?? 'false').toLowerCase()} | ` +
    `target=${buildConnectionSummary()}`,
);
