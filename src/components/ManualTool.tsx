import { useState } from 'preact/hooks';
import { GROUPS } from '../lib/rules';
import { ManualResult } from './ManualResult';
import LetterGenerator from './LetterGenerator';
import { computeDeadline } from '../lib/deadline';

const todayIso = () => new Date().toISOString().slice(0, 10);

/** Manual mode: group + market end date → deadline, computed in the browser without any request. */
export default function ManualTool({ presetGroup = '' }: { presetGroup?: string }) {
  const [groupId, setGroupId] = useState(presetGroup);
  const [mode, setMode] = useState<'still_selling' | 'ended'>('still_selling');
  const [endDate, setEndDate] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');

  return (
    <details class="mt-8 rounded border border-slate-300 p-4" open={Boolean(presetGroup)}>
      <summary class="cursor-pointer font-semibold">Keine Nummer? Gerät und Datum von Hand eingeben</summary>
      <div class="mt-4 space-y-4">
        <div>
          <label for="manual-group" class="block font-semibold">Produktgruppe</label>
          <select
            id="manual-group"
            class="mt-1 w-full rounded border border-slate-500 px-3 py-2"
            value={groupId}
            onChange={(e) => setGroupId((e.target as HTMLSelectElement).value)}
          >
            <option value="">Bitte wählen</option>
            {GROUPS.map((g) => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend class="font-semibold">Wird das Modell noch verkauft?</legend>
          <label class="mr-4 inline-flex items-center gap-2">
            <input type="radio" name="manual-mode" checked={mode === 'still_selling'} onChange={() => setMode('still_selling')} />
            Modell wird noch verkauft
          </label>
          <label class="inline-flex items-center gap-2">
            <input type="radio" name="manual-mode" checked={mode === 'ended'} onChange={() => setMode('ended')} />
            Zuletzt in Verkehr gebracht am
          </label>
        </fieldset>
        {mode === 'ended' && (
          <div>
            <label for="manual-end" class="block font-semibold">Datum, zuletzt in Verkehr gebracht</label>
            <input
              id="manual-end"
              type="date"
              class="mt-1 rounded border border-slate-500 px-3 py-2"
              value={endDate}
              onInput={(e) => setEndDate((e.target as HTMLInputElement).value)}
            />
          </div>
        )}
        <div>
          <label for="manual-purchase" class="block font-semibold">Kaufdatum (optional, bleibt in deinem Browser)</label>
          <input
            id="manual-purchase"
            type="date"
            class="mt-1 rounded border border-slate-500 px-3 py-2"
            value={purchaseDate}
            onInput={(e) => setPurchaseDate((e.target as HTMLInputElement).value)}
          />
        </div>
      </div>
      <ManualResult groupId={groupId} mode={mode} endDate={endDate} purchaseDate={purchaseDate} today={todayIso()} />
      {groupId && (mode === 'still_selling' || endDate) && (
        <LetterGenerator
          key={groupId}
          manual={{ groupId, model: '' }}
          today={todayIso()}
          deadline={computeDeadline(groupId, mode === 'ended' ? endDate : null, todayIso())}
        />
      )}
    </details>
  );
}
