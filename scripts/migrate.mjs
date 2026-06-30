import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env vars are required.');
  process.exit(1);
}

const client = createClient({ url, authToken });

await client.execute(`
  CREATE TABLE IF NOT EXISTS _migrations (
    name TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const migrationsDir = path.join(__dirname, '..', 'src', 'contents', 'migrations');
const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
const applied = new Set(
  (await client.execute('SELECT name FROM _migrations')).rows.map((r) => r.name)
);

for (const file of files) {
  if (applied.has(file)) {
    console.log(`Skipping ${file} (already applied)`);
    continue;
  }
  console.log(`Applying ${file}...`);
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  await client.executeMultiple(sql);
  await client.execute({ sql: 'INSERT INTO _migrations (name) VALUES (?)', args: [file] });
}

console.log('Done.');
client.close();
