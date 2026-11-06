import type { GroupId } from '../lib/rules';

export interface GroupFaq {
  q: string;
  a: string;
}

/** Worked example. `onMarketEnd` is a calendar date; the page computes the deadline with computeDeadline(). */
export interface GroupExample {
  /** Date the last unit of the model was placed on the EU market (YYYY-MM-DD). */
  onMarketEnd: string;
  /** EPREL registration number, only when a real committed fixture exists. */
  registrationNumber?: number;
  /** File name in src/fixtures when a recorded EPREL record backs the example. */
  fixture?: string;
  /** Honest note about where the example comes from. */
  note: string;
}

export interface GroupContent {
  id: GroupId;
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  ruleExplanation: string[];
  startNote: string;
  example: GroupExample;
  faq: GroupFaq[];
}

/** FAQ block shown on every group page. Not counted as group-specific text. */
export const SHARED_FAQ: GroupFaq[] = [
  {
    q: 'Ist die Reparatur kostenlos?',
    a: 'Nicht automatisch. Der Hersteller darf für die Reparatur außerhalb der Gewährleistung ein angemessenes Entgelt verlangen. Lass dir deshalb vorab einen Kostenvoranschlag geben.',
  },
  {
    q: 'Woher kommen die Daten?',
    a: 'Aus der EPREL-Produktdatenbank der Europäischen Kommission (Datenquelle: EPREL, Europäische Kommission). Die Frist rechnen wir aus dem dort genannten Datum, an dem das letzte Gerät des Modells in Verkehr gebracht wurde.',
  },
  {
    q: 'Ist das eine Rechtsberatung?',
    a: 'Nein. Der Check rechnet nach den EU-Ersatzteilregeln und gibt dir eine Orientierung. Im Streitfall helfen dir eine Verbraucherzentrale oder eine Rechtsberatung.',
  },
];

export const GROUP_CONTENT: GroupContent[] = [
  {
    id: 'waschmaschine',
    slug: 'waschmaschine',
    title: 'Waschmaschine: Bis wann muss der Hersteller reparieren? | Reparaturpflicht-Check',
    description:
      'Für Haushaltswaschmaschinen gilt eine Ersatzteil- und Reparaturfrist von 10 Jahren ab dem Ende des Verkaufs. So berechnest du die Frist für dein Modell.',
    h1: 'Waschmaschine: Bis wann muss der Hersteller reparieren?',
    intro: [
      'Bei einer Waschmaschine ist die Garantie meist längst vorbei, wenn der erste größere Defekt auftritt: Das Lager ist ausgeschlagen, die Pumpe verstopft oder die Elektronik reagiert nicht mehr. Dann stellt sich die Frage, ob sich eine Reparatur noch lohnt und ob du vom Hersteller überhaupt noch Hilfe verlangen kannst.',
      'Für Haushaltswaschmaschinen schreibt die EU seit dem 1. März 2021 vor, dass Hersteller Ersatzteile über einen langen Zeitraum bereithalten müssen. Seit Ende Juli 2026 knüpft das deutsche Recht daran eine Pflicht des Herstellers, auf Verlangen zu reparieren, auch nach Ablauf der Gewährleistung des Verkäufers.',
    ],
    ruleExplanation: [
      'Für Waschmaschinen gilt die Verordnung (EU) 2019/2023 mit einer Frist von 10 Jahren. Die Frist beginnt nicht mit deinem Kauf, sondern an dem Tag, an dem das letzte Gerät deines Modells in der EU in Verkehr gebracht wurde. Wer eine Maschine kauft, die schon länger im Handel war, hat deshalb oft weniger Restzeit, als er denkt. Wer ein Modell kurz vor dem Verkaufsende kauft, profitiert dagegen von der langen Restlaufzeit.',
      'Das Datum, an dem das letzte Gerät des Modells in Verkehr gebracht wurde, steht in der EPREL-Datenbank der Europäischen Kommission. Du findest den Eintrag über den QR-Code auf dem Energielabel oder über die Registriernummer. Gib sie auf der Startseite ein, der Check liest das Datum aus und rechnet die 10 Jahre dazu. Ohne Nummer kannst du das Datum auch von Hand eingeben.',
      'Wird ein Modell noch verkauft, steht in EPREL kein verlässliches Ende. Dann zeigt der Check nur den frühesten Zeitpunkt, bis zu dem die Pflicht mindestens läuft: heute plus 10 Jahre. Die tatsächliche Frist kann länger sein.',
    ],
    startNote:
      'Die Ersatzteilpflicht für Waschmaschinen gilt für Modelle, die ab dem 1. März 2021 in Verkehr gebracht wurden. Wurde das letzte Gerät deines Modells vorher verkauft, greift die Regel nicht.',
    example: {
      onMarketEnd: '2024-12-27',
      note: 'Dies ist ein Rechenbeispiel mit einem angenommenen Datum für das Ende des Verkaufs, kein abgerufener EPREL-Datensatz.',
    },
    faq: [
      {
        q: 'Gilt die Frist von 10 Jahren für jede Waschmaschine?',
        a: 'Sie gilt für Haushaltswaschmaschinen, deren letztes Gerät des Modells ab dem 1. März 2021 in Verkehr gebracht wurde. Für ältere Modelle greift diese EU-Regel nicht. Gewerbliche Maschinen sind nicht gemeint.',
      },
      {
        q: 'Muss der Hersteller wirklich selbst reparieren?',
        a: 'Der Hersteller ist zur Reparatur verpflichtet, darf sie aber über Servicepartner abwickeln. Eine Ausnahme besteht, wenn die Reparatur unmöglich ist. Ob das bei dir zutrifft, kann dieser Check nicht beurteilen.',
      },
      {
        q: 'Was ist, wenn meine Waschmaschine noch keine zwei Jahre alt ist?',
        a: 'Dann zuerst den Verkäufer in der Gewährleistung in die Pflicht nehmen. Das ist kostenlos. Die Herstellerpflicht kommt danach in Betracht.',
      },
      {
        q: 'Wo finde ich die Registriernummer?',
        a: 'Auf dem Energielabel als QR-Code oder als Nummer, im Datenblatt und in der Bedienungsanleitung. Eine genaue Anleitung steht auf der Seite „Registriernummer finden“.',
      },
    ],
  },
];

export function contentBySlug(slug: string): GroupContent | undefined {
  return GROUP_CONTENT.find((g) => g.slug === slug);
}

/** Words in the group-specific text (excludes SHARED_FAQ). */
export function groupWordCount(c: GroupContent): number {
  const text = [
    ...c.intro,
    ...c.ruleExplanation,
    c.startNote,
    c.example.note,
    ...c.faq.flatMap((f) => [f.q, f.a]),
  ].join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}
