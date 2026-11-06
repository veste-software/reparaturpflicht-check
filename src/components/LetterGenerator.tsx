import { useState } from 'preact/hooks';
import type { EprelRecord } from '../lib/eprel';
import type { DeadlineResult } from '../lib/deadline';
import { buildLetter, buildMailto, buildSubject, type LetterInput } from '../lib/letter';
import { track } from '../lib/analytics';

export interface LetterGeneratorProps {
  record?: EprelRecord | null;
  manual?: LetterInput['manual'];
  deadline: DeadlineResult | null;
  /** `YYYY-MM-DD` */
  today: string;
}

/** Copy text with the Clipboard API, falling back to a temporary textarea. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Letter form + live preview. Everything stays in the browser; nothing is sent anywhere. */
export default function LetterGenerator({ record, manual, deadline, today }: LetterGeneratorProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [fault, setFault] = useState('');
  const [status, setStatus] = useState('');
  const [model, setModel] = useState(manual?.model ?? '');
  const [number, setNumber] = useState(manual?.registrationNumber ?? '');

  const manualInput = manual ? { ...manual, model, registrationNumber: number } : null;
  const letter = buildLetter({ record, manual: manualInput, deadline, user: { name, address, fault }, today });
  const mailto = buildMailto(record?.contactDetails?.email, buildSubject(record, model), letter);

  async function onCopy() {
    const ok = await copyText(letter);
    setStatus(ok ? 'Brief kopiert.' : 'Kopieren hat nicht geklappt. Markiere den Text bitte von Hand.');
    if (ok) track('letter_created');
  }

  function onPrint() {
    const root = document.documentElement;
    root.classList.add('printing-letter');
    window.addEventListener('afterprint', () => root.classList.remove('printing-letter'), { once: true });
    track('letter_created');
    window.print();
  }

  return (
    <section class="mt-8" aria-labelledby="letter-heading">
      <div class="no-print">
        <h2 id="letter-heading" class="text-xl font-bold">Musterbrief an den Hersteller</h2>
        <p class="mt-1 text-sm">Deine Angaben bleiben in deinem Browser und werden nirgends hin gesendet.</p>
        <div class="mt-3 space-y-3">
          {manual && (
            <>
              <div>
                <label for="letter-model" class="block font-semibold">Marke und Modell</label>
                <input id="letter-model" type="text" class="mt-1 w-full rounded border border-slate-500 px-3 py-2" value={model} onInput={(e) => setModel((e.target as HTMLInputElement).value)} />
              </div>
              <div>
                <label for="letter-number" class="block font-semibold">EPREL-Registriernummer (optional)</label>
                <input id="letter-number" type="text" inputMode="numeric" class="mt-1 w-full rounded border border-slate-500 px-3 py-2" value={number} onInput={(e) => setNumber((e.target as HTMLInputElement).value)} />
              </div>
            </>
          )}
          <div>
            <label for="letter-name" class="block font-semibold">Dein Name</label>
            <input id="letter-name" type="text" autoComplete="name" class="mt-1 w-full rounded border border-slate-500 px-3 py-2" value={name} onInput={(e) => setName((e.target as HTMLInputElement).value)} />
          </div>
          <div>
            <label for="letter-address" class="block font-semibold">Deine Anschrift</label>
            <textarea id="letter-address" rows={3} autoComplete="street-address" class="mt-1 w-full rounded border border-slate-500 px-3 py-2" value={address} onInput={(e) => setAddress((e.target as HTMLTextAreaElement).value)} />
          </div>
          <div>
            <label for="letter-fault" class="block font-semibold">Was ist kaputt?</label>
            <textarea id="letter-fault" rows={3} class="mt-1 w-full rounded border border-slate-500 px-3 py-2" value={fault} onInput={(e) => setFault((e.target as HTMLTextAreaElement).value)} />
          </div>
        </div>
      </div>

      <h3 class="no-print mt-4 font-semibold">Vorschau</h3>
      <pre data-letter-print data-letter class="mt-1 whitespace-pre-wrap break-words rounded border border-slate-300 bg-white p-4 font-sans text-sm">{letter}</pre>

      <div class="no-print mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={onCopy} class="rounded bg-emerald-800 px-4 py-2 font-semibold text-white">Kopieren</button>
        <button type="button" onClick={onPrint} class="rounded border border-emerald-800 px-4 py-2 font-semibold text-emerald-900">Drucken / als PDF speichern</button>
        {mailto && (
          <a href={mailto} onClick={() => track('letter_created')} class="rounded border border-emerald-800 px-4 py-2 font-semibold text-emerald-900">
            Per E-Mail senden
          </a>
        )}
      </div>
      <p role="status" class="no-print mt-2 text-sm">{status}</p>
    </section>
  );
}
