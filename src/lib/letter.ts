import type { EprelRecord } from './eprel';
import type { DeadlineResult } from './deadline';
import { groupById, groupFromEprel, type RuleGroup } from './rules';
import { formatDate } from './format';

/** Legal basis. Exact paragraph not yet verified on gesetze-im-internet.de, so the general reference is used. */
export const LEGAL_BASIS = '§§ 479a ff. BGB';

export interface LetterUser {
  name: string;
  address: string;
  fault: string;
}

export interface LetterInput {
  /** EPREL record, if the user looked the device up. */
  record?: EprelRecord | null;
  /** Manual mode: group id, model and optional number. */
  manual?: { groupId: string; model: string; registrationNumber?: string } | null;
  deadline: DeadlineResult | null;
  user: LetterUser;
  /** `YYYY-MM-DD` */
  today: string;
}

const PLACEHOLDER = (what: string) => `[${what}]`;

function deadlineLine(d: DeadlineResult | null): string {
  if (!d) return 'Die Frist ist für dieses Gerät nicht bekannt.';
  switch (d.kind) {
    case 'covered':
      return `Laut EPREL-Daten und den EU-Ersatzteilregeln endet die Frist am ${formatDate(d.deadline)}. Sie ist also noch nicht abgelaufen.`;
    case 'expired':
      return `Laut EPREL-Daten und den EU-Ersatzteilregeln endete die Frist am ${formatDate(d.deadline)}. Ich bitte dennoch um ein freiwilliges Angebot.`;
    case 'still_on_market':
      return `Das Modell wird laut EPREL noch in Verkehr gebracht; die Frist läuft mindestens bis ${formatDate(d.minimumDate)}.`;
    case 'not_covered':
      return `Das Modell kam möglicherweise vor dem ${formatDate(d.appliesFrom)} auf den Markt. Ich bitte dennoch um ein freiwilliges Reparaturangebot.`;
    case 'no_parts_period':
      return 'Ich bitte um ein Reparaturangebot.';
  }
}

function contactLines(record: EprelRecord | null | undefined): string[] {
  const c = record?.contactDetails;
  if (!c) return [];
  return [
    c.serviceName ?? c.organisationTitle,
    [c.streetName, c.streetNumber].filter(Boolean).join(' '),
    [c.postalCode, c.city].filter(Boolean).join(' '),
    c.country,
  ].filter((l): l is string => Boolean(l));
}

/** Pure letter builder: plain text, no network, no storage. */
export function buildLetter(input: LetterInput): string {
  const { record, manual, deadline, user, today } = input;
  const group: RuleGroup | null = record ? groupFromEprel(record.productGroup) : manual ? groupById(manual.groupId) : null;
  const brand = record?.supplierOrTrademark ?? '';
  const model = record?.modelIdentifier ?? manual?.model ?? '';
  const number = record?.eprelRegistrationNumber ?? manual?.registrationNumber ?? '';
  const recipient = contactLines(record);
  const device = [brand, model].filter(Boolean).join(' ');

  const lines: string[] = [
    user.name.trim() || PLACEHOLDER('Dein Name'),
    ...(user.address.trim() ? user.address.trim().split('\n') : [PLACEHOLDER('Deine Anschrift')]),
    '',
    ...(recipient.length ? recipient : [PLACEHOLDER('Hersteller / Service-Adresse')]),
    '',
    formatDate(today),
    '',
    `Reparaturanfrage nach ${LEGAL_BASIS}: ${device || PLACEHOLDER('Gerät')}`,
    '',
    'Sehr geehrte Damen und Herren,',
    '',
    `ich bitte um die Reparatur meines Geräts${group ? ` (${group.label})` : ''}.`,
    '',
    `Marke und Modell: ${device || PLACEHOLDER('Marke und Modell')}`,
    `EPREL-Registriernummer: ${number || PLACEHOLDER('Nummer')}`,
    `Fehlerbeschreibung: ${user.fault.trim() || PLACEHOLDER('Was ist kaputt?')}`,
    '',
    deadlineLine(deadline),
    `Rechtsgrundlage: ${LEGAL_BASIS} in Verbindung mit den EU-Ersatzteilregeln${group ? ` (${group.regulation})` : ''}.`,
    '',
    'Bitte schicken Sie mir vor der Reparatur einen Kostenvoranschlag. Ich weiß, dass die Reparatur ein angemessenes Entgelt kosten kann. Falls Sie die Reparatur ablehnen, bitte ich um eine schriftliche Begründung.',
    '',
    'Mit freundlichen Grüßen',
    user.name.trim() || PLACEHOLDER('Dein Name'),
  ];
  return lines.join('\n');
}

export function buildSubject(record: EprelRecord | null | undefined, model?: string): string {
  const m = [record?.supplierOrTrademark, record?.modelIdentifier ?? model].filter(Boolean).join(' ');
  return `Reparaturanfrage${m ? `: ${m}` : ''}`;
}

/** `mailto:` link, or null when the manufacturer's e-mail is unknown. */
export function buildMailto(email: string | null | undefined, subject: string, body: string): string | null {
  if (!email) return null;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
