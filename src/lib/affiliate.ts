import type { DeadlineResult } from './deadline';

export interface AffiliateEnv {
  PUBLIC_AFFILIATE_PARTS_URL_TEMPLATE?: string;
  PUBLIC_AFFILIATE_REFURB_URL?: string;
}

export interface AffiliateSlot {
  id: 'parts' | 'refurb' | 'local';
  label: string;
  href: string;
  /** true for paid links: they get rel="sponsored" and the "Anzeige" label. */
  sponsored: boolean;
  /** Short badge shown next to the link; empty for non-affiliate slots. */
  badge: string;
}

export interface AffiliateInput {
  /** Rule group id, or null when unknown. */
  groupId: string | null;
  deadline: DeadlineResult;
  model?: string | null;
}

const REFURB_GROUPS = new Set(['smartphone-tablet', 'fernseher-monitor']);

/** Fill `{model}` (URL-encoded) in a template. Only http(s) templates are accepted. */
export function fillTemplate(template: string, model: string): string | null {
  if (!/^https?:\/\//i.test(template)) return null;
  return template.replaceAll('{model}', encodeURIComponent(model));
}

/**
 * Which slots to show below a result. Paid slots only render when their env var is set.
 * The neutral "Reparaturcafé oder Fachbetrieb" link is always included and is never marked as an ad.
 */
export function affiliateSlots(input: AffiliateInput, env: AffiliateEnv): AffiliateSlot[] {
  const slots: AffiliateSlot[] = [];
  const model = (input.model ?? '').trim();
  const kind = input.deadline.kind;

  const partsTemplate = env.PUBLIC_AFFILIATE_PARTS_URL_TEMPLATE?.trim();
  if (partsTemplate && model && (kind === 'covered' || kind === 'expired' || kind === 'still_on_market')) {
    const href = fillTemplate(partsTemplate, model);
    if (href) slots.push({ id: 'parts', label: 'Ersatzteile für dein Modell suchen', href, sponsored: true, badge: 'Anzeige' });
  }

  const refurb = env.PUBLIC_AFFILIATE_REFURB_URL?.trim();
  if (
    refurb &&
    /^https?:\/\//i.test(refurb) &&
    input.groupId &&
    REFURB_GROUPS.has(input.groupId) &&
    (kind === 'expired' || kind === 'not_covered')
  ) {
    slots.push({ id: 'refurb', label: 'Generalüberholtes Gerät ansehen', href: refurb, sponsored: true, badge: 'Anzeige' });
  }

  slots.push({
    id: 'local',
    label: 'Reparaturcafé oder Fachbetrieb in der Nähe',
    href: 'https://www.google.com/search?q=Reparaturcaf%C3%A9+in+meiner+N%C3%A4he',
    sponsored: false,
    badge: '',
  });
  return slots;
}
