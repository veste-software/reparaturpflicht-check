import type { EprelRecord } from './eprel';

export type LookupOutcome =
  | { ok: true; record: EprelRecord; fetchedAt: string }
  | { ok: false; error: string };

const OFFLINE = 'Keine Verbindung. Bitte prüfe deine Internetverbindung und versuche es erneut.';
const GENERIC = 'Die EPREL-Datenbank ist gerade nicht erreichbar. Bitte versuche es später noch einmal.';

/** Call the proxy for one registration number and map every failure to a German message. */
export async function lookupRegistration(
  id: number,
  proxyBase: string,
  fetchImpl: typeof fetch = fetch,
): Promise<LookupOutcome> {
  let res: Response;
  try {
    res = await fetchImpl(`${proxyBase}${id}`, { headers: { Accept: 'application/json' } });
  } catch {
    return { ok: false, error: OFFLINE };
  }
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON body (e.g. a static host without functions): fall through to the generic message.
  }
  const obj = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  if (!res.ok) {
    if (res.status === 400) return { ok: false, error: typeof obj.error === 'string' ? obj.error : 'Ungültige Registriernummer.' };
    if (res.status === 404) return { ok: false, error: typeof obj.error === 'string' ? obj.error : 'Zu dieser Registriernummer gibt es keinen Eintrag in EPREL.' };
    return { ok: false, error: typeof obj.error === 'string' ? obj.error : GENERIC };
  }
  if (typeof obj.fetchedAt !== 'string' || !('productGroup' in obj)) return { ok: false, error: GENERIC };
  const { fetchedAt, ...record } = obj;
  return { ok: true, record: record as unknown as EprelRecord, fetchedAt };
}

/** `/preview/qr/1417304/` → 1417304 (last numeric path segment after `qr`). */
export function idFromQrPath(pathname: string): string | null {
  const m = /\/qr\/(\d{1,10})\/?$/.exec(pathname);
  return m ? m[1] : null;
}
