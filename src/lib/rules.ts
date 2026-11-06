/**
 * Rule table for the manufacturer repair duty (§§ 479a ff. BGB) via EU ecodesign spare-parts rules.
 * Values come from the Verbraucherzentrale table cited in SPEC.md. `verified: false` means the row was
 * NOT yet checked against EUR-Lex; the UI must then not list part categories.
 */
export type GroupId =
  | 'waschmaschine'
  | 'waschtrockner'
  | 'geschirrspueler'
  | 'kuehlschrank'
  | 'fernseher-monitor'
  | 'trockner'
  | 'smartphone-tablet'
  | 'schnurlostelefon';

export interface RuleGroup {
  id: GroupId;
  label: string;
  /** Page slug; null when there is no group page (manual mode only). */
  slug: string | null;
  /** EPREL productGroup prefixes (lower case). */
  prefixes: string[];
  regulation: string;
  regulationUrl: string;
  /** ISO date from which the spare-parts duty applies to models on the market. */
  appliesFrom: string;
  /** Years used for the deadline (the shorter period where parts differ). */
  years: number;
  /** Text shown when the period differs by part. */
  partSplit?: string;
  verified: boolean;
}

export const GROUPS: RuleGroup[] = [
  {
    id: 'waschmaschine',
    label: 'Waschmaschine',
    slug: 'waschmaschine',
    prefixes: ['washingmachines'],
    regulation: 'Verordnung (EU) 2019/2023',
    regulationUrl: 'https://eur-lex.europa.eu/eli/reg/2019/2023/oj',
    appliesFrom: '2021-03-01',
    years: 10,
    verified: false,
  },
  {
    id: 'waschtrockner',
    label: 'Waschtrockner',
    slug: 'waschtrockner',
    prefixes: ['washerdryers'],
    regulation: 'Verordnung (EU) 2019/2023',
    regulationUrl: 'https://eur-lex.europa.eu/eli/reg/2019/2023/oj',
    appliesFrom: '2021-03-01',
    years: 10,
    verified: false,
  },
  {
    id: 'geschirrspueler',
    label: 'Geschirrspüler',
    slug: 'geschirrspueler',
    prefixes: ['dishwashers'],
    regulation: 'Verordnung (EU) 2019/2022',
    regulationUrl: 'https://eur-lex.europa.eu/eli/reg/2019/2022/oj',
    appliesFrom: '2021-03-01',
    years: 7,
    partSplit: '7 oder 10 Jahre je nach Ersatzteil',
    verified: false,
  },
  {
    id: 'kuehlschrank',
    label: 'Kühl-/Gefriergerät',
    slug: 'kuehlschrank',
    prefixes: ['refrigeratingappliances', 'refrigerating'],
    regulation: 'Verordnung (EU) 2019/2019',
    regulationUrl: 'https://eur-lex.europa.eu/eli/reg/2019/2019/oj',
    appliesFrom: '2021-03-01',
    years: 7,
    partSplit: '7 oder 10 Jahre je nach Ersatzteil',
    verified: false,
  },
  {
    id: 'fernseher-monitor',
    label: 'Fernseher / Monitor',
    slug: 'fernseher-monitor',
    prefixes: ['electronicdisplays'],
    regulation: 'Verordnung (EU) 2019/2021',
    regulationUrl: 'https://eur-lex.europa.eu/eli/reg/2019/2021/oj',
    appliesFrom: '2021-03-01',
    years: 7,
    verified: false,
  },
  {
    id: 'trockner',
    label: 'Wäschetrockner',
    slug: 'trockner',
    prefixes: ['tumbledryers'],
    regulation: 'Verordnung (EU) 2023/2533',
    regulationUrl: 'https://eur-lex.europa.eu/eli/reg/2023/2533/oj',
    appliesFrom: '2025-07-01',
    years: 10,
    verified: false,
  },
  {
    id: 'smartphone-tablet',
    label: 'Smartphone / Tablet',
    slug: 'smartphone-tablet',
    prefixes: ['smartphones'],
    regulation: 'Verordnung (EU) 2023/1670',
    regulationUrl: 'https://eur-lex.europa.eu/eli/reg/2023/1670/oj',
    appliesFrom: '2025-06-20',
    years: 7,
    verified: false,
  },
  {
    id: 'schnurlostelefon',
    label: 'Schnurlostelefon',
    slug: null,
    prefixes: [],
    regulation: 'Verordnung (EU) 2023/1670',
    regulationUrl: 'https://eur-lex.europa.eu/eli/reg/2023/1670/oj',
    appliesFrom: '2025-06-20',
    years: 7,
    verified: false,
  },
];

export function groupById(id: string): RuleGroup | null {
  return GROUPS.find((g) => g.id === id) ?? null;
}

/** Map an EPREL `productGroup` (e.g. "washingmachines2019") to a rule group by prefix. */
export function groupFromEprel(productGroup: string | null | undefined): RuleGroup | null {
  const pg = (productGroup ?? '').toLowerCase();
  if (!pg) return null;
  return GROUPS.find((g) => g.prefixes.some((p) => pg.startsWith(p))) ?? null;
}

/** Period text for the UI: a single number only when the row is unambiguous. */
export function periodText(group: RuleGroup): string {
  return group.partSplit ?? `${group.years} Jahre`;
}
