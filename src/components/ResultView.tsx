import type { EprelRecord } from '../lib/eprel';
import { computeDeadline, type DeadlineResult } from '../lib/deadline';
import { groupFromEprel, periodText, type RuleGroup } from '../lib/rules';
import { formatDate } from '../lib/format';
import { isWithinWarranty } from '../lib/warranty';

export interface ResultViewProps {
  record: EprelRecord;
  /** `YYYY-MM-DD` */
  today: string;
  /** ISO timestamp of the EPREL fetch */
  fetchedAt: string;
  /** Optional purchase date (`YYYY-MM-DD`); only used for the warranty hint, never stored. */
  purchaseDate?: string | null;
}

function formatFetchedAt(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
  return m ? `${m[3]}.${m[2]}.${m[1]}, ${m[4]}:${m[5]} UTC` : iso;
}

function headline(result: DeadlineResult): { text: string; tone: string } {
  switch (result.kind) {
    case 'covered':
      return { text: `Hersteller muss reparieren bis ${formatDate(result.deadline)}`, tone: 'border-emerald-700 bg-emerald-50' };
    case 'expired':
      return { text: `Frist abgelaufen am ${formatDate(result.deadline)}`, tone: 'border-amber-700 bg-amber-50' };
    case 'still_on_market':
      return { text: 'Wird laut EPREL noch in Verkehr gebracht', tone: 'border-sky-700 bg-sky-50' };
    case 'not_covered':
      return { text: 'Wahrscheinlich nicht erfasst', tone: 'border-slate-500 bg-slate-50' };
    case 'no_parts_period':
      return { text: 'Für diese Produktgruppe gibt es (noch) keine Ersatzteilfrist', tone: 'border-slate-500 bg-slate-50' };
  }
}

function explanation(result: DeadlineResult, group: RuleGroup | null): string {
  switch (result.kind) {
    case 'covered':
      return `Laut EPREL-Daten und den EU-Ersatzteilregeln endet die Frist am ${formatDate(result.deadline)}.`;
    case 'expired':
      return `Laut EPREL-Daten und den EU-Ersatzteilregeln endete die Frist am ${formatDate(result.deadline)}. Frage trotzdem nach freiwilligen Angeboten des Herstellers.`;
    case 'still_on_market':
      return `Die Frist läuft mindestens bis ${formatDate(result.minimumDate)} und endet ${result.years} Jahre nachdem der Hersteller das Modell nicht mehr in Verkehr bringt.`;
    case 'not_covered':
      return `Das letzte Gerät des Modells kam vor dem ${formatDate(result.appliesFrom)} auf den Markt, ab dem die Ersatzteilpflicht gilt. Prüfe die Gewährleistung beim Verkäufer und freiwillige Angebote des Herstellers.`;
    case 'no_parts_period':
      return `Für ${group ? group.label : 'diese Produktgruppe'} liefert EPREL keine Ersatzteilfrist. Für Staubsauger, bestimmte Batterien und Datenspeicher gilt eine Reparaturpflicht ohne feste Ersatzteilfrist.`;
  }
}

/** Headline + explanation box, shared by the EPREL result and the manual mode. */
export function DeadlineBox({ result, group }: { result: DeadlineResult; group: RuleGroup | null }) {
  const { text, tone } = headline(result);
  return (
    <div class={`rounded-lg border-l-4 p-4 ${tone}`}>
      <h2 class="text-xl font-bold">{text}</h2>
      <p class="mt-2">{explanation(result, group)}</p>
    </div>
  );
}

export function WarrantyHint({ purchaseDate, today }: { purchaseDate?: string | null; today: string }) {
  if (!isWithinWarranty(purchaseDate, today)) return null;
  return (
    <div class="rounded-lg border-l-4 border-emerald-700 bg-emerald-50 p-4" data-warranty>
      <h2 class="text-xl font-bold">Zuerst kostenlos: Gewährleistung beim Verkäufer</h2>
      <p class="mt-2">
        Dein Kauf liegt weniger als 2 Jahre zurück. Wende dich zuerst an den Verkäufer. Der Weg über den Hersteller
        ist die Alternative danach.
      </p>
    </div>
  );
}

export function ResultView({ record, today, fetchedAt, purchaseDate }: ResultViewProps) {
  const group = groupFromEprel(record.productGroup);
  const result = computeDeadline(group, record.onMarketEndDate, today);
  const c = record.contactDetails;
  const number = record.eprelRegistrationNumber;
  const eprelUrl = number ? `https://eprel.ec.europa.eu/qr/${number}` : 'https://eprel.ec.europa.eu/';
  const address = c
    ? [
        [c.streetName, c.streetNumber].filter(Boolean).join(' '),
        [c.postalCode, c.city].filter(Boolean).join(' '),
        c.country,
      ].filter(Boolean)
    : [];

  return (
    <section aria-live="polite" class="mt-6 space-y-4" data-result>
      <WarrantyHint purchaseDate={purchaseDate} today={today} />
      <DeadlineBox result={result} group={group} />

      <dl class="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
        <dt class="font-semibold">Marke</dt>
        <dd>{record.supplierOrTrademark ?? 'unbekannt'}</dd>
        <dt class="font-semibold">Modell</dt>
        <dd>{record.modelIdentifier ?? 'unbekannt'}</dd>
        <dt class="font-semibold">Zuletzt in Verkehr gebracht</dt>
        <dd>{record.onMarketEndDate ? formatDate(record.onMarketEndDate) : 'kein Datum in EPREL'}</dd>
        {group && (
          <>
            <dt class="font-semibold">Frist</dt>
            <dd>{periodText(group)} nach dem letzten Inverkehrbringen</dd>
          </>
        )}
        {result.kind === 'covered' || result.kind === 'expired' ? (
          <>
            <dt class="font-semibold">Frist endet</dt>
            <dd>{formatDate(result.deadline)}</dd>
          </>
        ) : null}
      </dl>

      {c && (
        <div class="rounded border border-slate-300 p-4">
          <h3 class="font-semibold">Service-Kontakt laut EPREL</h3>
          <p>{c.serviceName ?? c.organisationTitle}</p>
          {address.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {c.phone && <p>Tel.: {c.phone}</p>}
          {c.email && <p>E-Mail: {c.email}</p>}
        </div>
      )}

      <p class="text-sm">
        Datenquelle: EPREL, Europäische Kommission.{' '}
        <a class="underline" href={eprelUrl} rel="noopener">
          Eintrag bei EPREL ansehen
        </a>
        . Abgerufen am {formatFetchedAt(fetchedAt)}.
      </p>
      <p class="text-sm">Die Reparatur kann ein angemessenes Entgelt kosten.</p>
      <p class="text-sm font-semibold">Keine Rechtsberatung.</p>
    </section>
  );
}
