export type ParseResult = { ok: true; id: number } | { ok: false; error: string };

const MAX_DIGITS = 10;

/** Extract the EPREL registration number from a bare number or an EPREL URL. */
export function parseRegistrationInput(input: string): ParseResult {
  const text = (input ?? '').trim();
  if (!text) return { ok: false, error: 'Bitte gib eine Registriernummer oder einen EPREL-Link ein.' };

  let candidate = text;
  if (!/^\d+$/.test(text)) {
    // Drop query and fragment, then take the last path segment.
    const path = text.split(/[?#]/)[0].replace(/\/+$/, '');
    const last = path.split('/').pop() ?? '';
    if (!/eprel\.ec\.europa\.eu/i.test(path) || !/^\d+$/.test(last)) {
      return {
        ok: false,
        error: 'Das sieht nicht wie eine EPREL-Registriernummer oder ein EPREL-Link aus. Beispiel: 1417304',
      };
    }
    candidate = last;
  }

  if (candidate.length > MAX_DIGITS) {
    return { ok: false, error: 'Die Registriernummer ist zu lang (höchstens 10 Ziffern).' };
  }
  const id = Number(candidate);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: 'Die Registriernummer muss größer als 0 sein.' };
  }
  return { ok: true, id };
}
