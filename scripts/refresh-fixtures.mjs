// Manual script: fetch one EPREL record per registration number and store it with a meta file.
// Usage: node scripts/refresh-fixtures.mjs 1417304 [more numbers]
// One request per number, never run in CI. Set EPREL_USER_AGENT_CONTACT for the User-Agent.
import { writeFile, mkdir } from 'node:fs/promises';

const contact = process.env.EPREL_USER_AGENT_CONTACT || 'contact-not-set';
const ids = process.argv.slice(2).filter((a) => /^\d{1,10}$/.test(a));
if (ids.length === 0) {
  console.error('Usage: node scripts/refresh-fixtures.mjs <registration number> [...]');
  process.exit(1);
}
await mkdir(new URL('../src/fixtures/', import.meta.url), { recursive: true });
for (const id of ids) {
  const url = `https://eprel.ec.europa.eu/api/product/${id}`;
  const res = await fetch(url, { headers: { 'User-Agent': `Reparaturpflicht-Check (+${contact})` } });
  if (!res.ok) {
    console.error(`${id}: HTTP ${res.status}, skipped`);
    continue;
  }
  const body = await res.text();
  JSON.parse(body); // fail loudly on invalid JSON
  await writeFile(new URL(`../src/fixtures/eprel-${id}.json`, import.meta.url), body);
  const meta = { fetchedAt: new Date().toISOString(), url };
  await writeFile(new URL(`../src/fixtures/eprel-${id}.meta.json`, import.meta.url), JSON.stringify(meta, null, 2) + '\n');
  console.log(`${id}: saved`);
}
