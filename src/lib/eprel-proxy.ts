import { pickEprelFields } from './eprel';

export interface ProxyEnv {
  EPREL_USER_AGENT_CONTACT?: string;
}

const EPREL_BASE = 'https://eprel.ec.europa.eu/api/product/';

function json(body: unknown, status: number, cache: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache },
  });
}

/** Keyless, whitelisting proxy logic. Never exposes stack traces. */
export async function handleEprelRequest(
  id: string,
  fetchImpl: typeof fetch,
  env: ProxyEnv,
  now: () => Date = () => new Date(),
): Promise<Response> {
  if (!/^\d{1,10}$/.test(id)) {
    return json({ error: 'Ungültige Registriernummer. Bitte nur Ziffern eingeben.' }, 400, 'no-store');
  }
  const bad = 'Die EPREL-Datenbank ist gerade nicht erreichbar. Bitte versuche es später noch einmal.';
  const notFound = { error: 'Zu dieser Registriernummer gibt es keinen Eintrag in EPREL. Bitte prüfe die Nummer.' };
  let upstream: Response;
  try {
    upstream = await fetchImpl(`${EPREL_BASE}${id}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': `Reparaturpflicht-Check (+${env.EPREL_USER_AGENT_CONTACT || 'kontakt-folgt'})`,
      },
    });
  } catch {
    return json({ error: bad }, 502, 'no-store');
  }
  if (upstream.status === 404) return json(notFound, 404, 'no-store');
  if (!upstream.ok) return json({ error: bad }, 502, 'no-store');

  let raw: unknown;
  try {
    raw = await upstream.json();
  } catch {
    return json({ error: bad }, 502, 'no-store');
  }
  if (!raw || typeof raw !== 'object' || Object.keys(raw as object).length === 0) {
    return json(notFound, 404, 'no-store');
  }
  const record = pickEprelFields(raw);
  if (!record.modelIdentifier && !record.productGroup) return json(notFound, 404, 'no-store');
  return json({ ...record, fetchedAt: now().toISOString() }, 200, 'public, max-age=3600, s-maxage=86400');
}
