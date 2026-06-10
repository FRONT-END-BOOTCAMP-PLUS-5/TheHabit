/**
 * Supabase DB에 스키마를 적용합니다.
 * 사용법: npm run db:setup
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const { Client } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, '../supabase/migrations/20250609120000_initial_schema.sql');

// .env 파일 자동 로드 (dotenv 없이)
const envPath = join(__dirname, '../.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL이 필요합니다.');
  console.error('Supabase Dashboard > Project Settings > Database > Connection string');
  process.exit(1);
}

const sql = readFileSync(sqlPath, 'utf8');
const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log('✅ Supabase 스키마 적용 완료');
} catch (error) {
  console.error('❌ 스키마 적용 실패:', error);
  process.exit(1);
} finally {
  await client.end();
}
