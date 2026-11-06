import { useEffect, useState } from 'preact/hooks';
import { parseRegistrationInput } from '../lib/parse';
import { lookupRegistration, idFromQrPath, type LookupOutcome } from '../lib/lookup';
import { joinBase } from '../lib/url';
import { track } from '../lib/analytics';
import { ResultView } from './ResultView';

const base = import.meta.env.BASE_URL;
const proxyBase: string = import.meta.env.PUBLIC_EPREL_PROXY_URL || joinBase(base, 'api/eprel/') ;

/** Calendar date of the browser's today as `YYYY-MM-DD` (UTC). */
const todayIso = () => new Date().toISOString().slice(0, 10);

export default function LookupTool({ readFromPath = false }: { readFromPath?: boolean }) {
  const [value, setValue] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<Extract<LookupOutcome, { ok: true }> | null>(null);

  async function run(raw: string) {
    const parsed = parseRegistrationInput(raw);
    if (!parsed.ok) {
      setError(parsed.error);
      setOutcome(null);
      return;
    }
    setError(null);
    setLoading(true);
    const res = await lookupRegistration(parsed.id, proxyBase);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      setOutcome(null);
      return;
    }
    setOutcome(res);
    track('lookup_success');
    try {
      history.replaceState(null, '', joinBase(base, `qr/${parsed.id}`));
    } catch {
      // Ignore: the URL update is a convenience only.
    }
  }

  useEffect(() => {
    if (!readFromPath) return;
    const id = idFromQrPath(location.pathname);
    if (id) {
      setValue(id);
      void run(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div class="mt-6">
      <form
        class="flex flex-col gap-2 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          void run(value);
        }}
      >
        <div class="flex-1">
          <label for="reg-input" class="block font-semibold">
            EPREL-Registriernummer oder Link vom Energielabel
          </label>
          <input
            id="reg-input"
            type="text"
            inputMode="text"
            autoComplete="off"
            class="mt-1 w-full rounded border border-slate-500 px-3 py-2"
            placeholder="z. B. 1417304 oder https://eprel.ec.europa.eu/qr/1417304"
            value={value}
            aria-describedby={error ? 'reg-error' : undefined}
            aria-invalid={error ? 'true' : undefined}
            onInput={(e) => setValue((e.target as HTMLInputElement).value)}
          />
        </div>
        <button type="submit" disabled={loading} class="rounded bg-emerald-800 px-4 py-2 font-semibold text-white disabled:opacity-60">
          {loading ? 'Suche läuft …' : 'Frist prüfen'}
        </button>
      </form>
      <div class="mt-3">
        <label for="reg-purchase" class="block text-sm font-semibold">
          Kaufdatum (optional, bleibt in deinem Browser)
        </label>
        <input
          id="reg-purchase"
          type="date"
          class="mt-1 rounded border border-slate-500 px-3 py-2"
          value={purchaseDate}
          onInput={(e) => setPurchaseDate((e.target as HTMLInputElement).value)}
        />
      </div>
      <div aria-live="polite">
        {error && (
          <p id="reg-error" role="alert" class="mt-3 rounded border border-red-700 bg-red-50 p-3 text-red-900">
            {error}
          </p>
        )}
        {outcome && <ResultView record={outcome.record} today={todayIso()} fetchedAt={outcome.fetchedAt} purchaseDate={purchaseDate} />}
      </div>
    </div>
  );
}
