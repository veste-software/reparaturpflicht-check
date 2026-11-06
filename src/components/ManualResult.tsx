import { computeDeadline } from '../lib/deadline';
import { groupById, periodText } from '../lib/rules';
import { DeadlineBox, WarrantyHint } from './ResultView';

export interface ManualResultProps {
  groupId: string;
  /** `still_selling`, or `ended` together with `endDate` */
  mode: 'still_selling' | 'ended';
  endDate: string;
  purchaseDate?: string | null;
  today: string;
}

/** Pure result of the manual mode: no network, only `computeDeadline`. */
export function ManualResult({ groupId, mode, endDate, purchaseDate, today }: ManualResultProps) {
  const group = groupById(groupId);
  if (!group) return null;
  if (mode === 'ended' && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) return null;
  const result = computeDeadline(group, mode === 'ended' ? endDate : null, today);
  return (
    <section aria-live="polite" class="mt-6 space-y-4" data-result>
      <WarrantyHint purchaseDate={purchaseDate} today={today} />
      <DeadlineBox result={result} group={group} />
      <p class="text-sm">
        Ersatzteilfrist für {group.label}: {periodText(group)} nach dem letzten Inverkehrbringen ({group.regulation}).
      </p>
      <p class="text-sm">Die Reparatur kann ein angemessenes Entgelt kosten.</p>
      <p class="text-sm font-semibold">Keine Rechtsberatung.</p>
    </section>
  );
}
