import { useState } from 'preact/hooks';
import { GROUPS } from '../lib/rules';
import { computeDeadline } from '../lib/deadline';
import LetterGenerator from './LetterGenerator';

const todayIso = () => new Date().toISOString().slice(0, 10);

/** Letter generator with manual device data (no EPREL lookup needed). */
export default function MusterbriefTool() {
  const [groupId, setGroupId] = useState('');
  const [mode, setMode] = useState<'still_selling' | 'ended'>('still_selling');
  const [endDate, setEndDate] = useState('');
  const today = todayIso();
  const ready = groupId !== '' && (mode === 'still_selling' || /^\d{4}-\d{2}-\d{2}$/.test(endDate));

  return (
    <div class="mt-6">
      <div class="space-y-4">
        <div>
          <label for="mb-group" class="block font-semibold">Produktgruppe</label>
          <select id="mb-group" class="mt-1 w-full rounded border border-slate-500 px-3 py-2" value={groupId} onChange={(e) => setGroupId((e.target as HTMLSelectElement).value)}>
            <option value="">Bitte wählen</option>
            {GROUPS.map((g) => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend class="font-semibold">Wird das Modell noch verkauft?</legend>
          <label class="mr-4 inline-flex items-center gap-2">
            <input type="radio" name="mb-mode" checked={mode === 'still_selling'} onChange={() => setMode('still_selling')} />
            Modell wird noch verkauft
          </label>
          <label class="inline-flex items-center gap-2">
            <input type="radio" name="mb-mode" checked={mode === 'ended'} onChange={() => setMode('ended')} />
            Zuletzt in Verkehr gebracht am
          </label>
        </fieldset>
        {mode === 'ended' && (
          <div>
            <label for="mb-end" class="block font-semibold">Datum, zuletzt in Verkehr gebracht</label>
            <input id="mb-end" type="date" class="mt-1 rounded border border-slate-500 px-3 py-2" value={endDate} onInput={(e) => setEndDate((e.target as HTMLInputElement).value)} />
          </div>
        )}
      </div>
      {ready && (
        <LetterGenerator
          key={groupId}
          manual={{ groupId, model: '' }}
          today={today}
          deadline={computeDeadline(groupId, mode === 'ended' ? endDate : null, today)}
        />
      )}
    </div>
  );
}
