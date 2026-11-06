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
    title: 'Recht auf Reparatur Waschmaschine: Frist prüfen',
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
  {
    id: 'geschirrspueler',
    slug: 'geschirrspueler',
    title: 'Recht auf Reparatur Geschirrspüler: Frist prüfen',
    description:
      'Für Haushaltsgeschirrspüler gelten EU-Ersatzteilfristen von 7 oder 10 Jahren je nach Teil. So findest du heraus, bis wann dein Hersteller reparieren muss.',
    h1: 'Geschirrspüler: Bis wann muss der Hersteller reparieren?',
    intro: [
      'Ein Geschirrspüler arbeitet täglich mit Hitze, Wasser und Reinigerchemie. Nach einigen Jahren fallen typische Teile aus: die Umwälzpumpe, das Heizelement, die Türdichtung oder die Steuerplatine. Ob sich eine Reparatur lohnt, hängt oft davon ab, ob der Hersteller das Ersatzteil überhaupt noch liefert.',
      'Für Haushaltsgeschirrspüler schreibt die EU seit dem 1. März 2021 vor, dass Hersteller Ersatzteile über mehrere Jahre bereithalten. Seit Ende Juli 2026 knüpft das deutsche Recht daran eine Pflicht des Herstellers, auf Verlangen zu reparieren, auch nachdem die Gewährleistung des Verkäufers abgelaufen ist.',
    ],
    ruleExplanation: [
      'Für Geschirrspüler gilt die Verordnung (EU) 2019/2022. Die Fristen sind nach Ersatzteil gestaffelt: Für einen Teil der Ersatzteile gelten 7 Jahre, für einen anderen Teil 10 Jahre. Weil der Check nicht weiß, welches Teil bei dir defekt ist, rechnen wir vorsichtig mit der kürzeren Frist von 7 Jahren. Bei manchen Teilen kann die Frist also länger sein.',
      'Die Frist beginnt nicht mit deinem Kauf, sondern an dem Tag, an dem das letzte Gerät deines Modells in der EU in Verkehr gebracht wurde. Dieses Datum steht in der EPREL-Datenbank der Europäischen Kommission. Du erreichst den Eintrag über den QR-Code auf dem Energielabel oder über die Registriernummer.',
      'Wird ein Modell noch verkauft, steht in EPREL kein verlässliches Ende. Dann zeigt der Check nur den frühesten Zeitpunkt, bis zu dem die Pflicht mindestens läuft. Die tatsächliche Frist kann länger sein.',
    ],
    startNote:
      'Die Ersatzteilpflicht für Geschirrspüler gilt für Modelle, die ab dem 1. März 2021 in Verkehr gebracht wurden. Wurde das letzte Gerät deines Modells vor diesem Datum verkauft, greift die Regel nicht.',
    example: {
      onMarketEnd: '2024-06-30',
      note: 'Dies ist ein Rechenbeispiel mit einem angenommenen Datum für das Ende des Verkaufs, kein abgerufener EPREL-Datensatz. Gerechnet wird mit der kürzeren Frist von 7 Jahren.',
    },
    faq: [
      {
        q: 'Gilt für meinen Geschirrspüler die Frist von 7 oder von 10 Jahren?',
        a: 'Das hängt vom defekten Ersatzteil ab. Der Check zeigt vorsichtig die kürzere Frist von 7 Jahren. Frag den Hersteller im Zweifel, welche Frist für das betroffene Teil gilt.',
      },
      {
        q: 'Gilt die Regel auch für Einbaugeschirrspüler?',
        a: 'Ja, die Verordnung erfasst Haushaltsgeschirrspüler, auch Einbaugeräte. Kleine Tischgeräte mit weniger als sieben Maßgedecken können ausgenommen sein. Prüfe das in EPREL.',
      },
      {
        q: 'Was ist, wenn mein Gerät noch keine zwei Jahre alt ist?',
        a: 'Dann zuerst den Verkäufer in der Gewährleistung in die Pflicht nehmen. Das ist kostenlos. Die Herstellerpflicht kommt danach in Betracht.',
      },
    ],
  },
  {
    id: 'kuehlschrank',
    slug: 'kuehlschrank',
    title: 'Recht auf Reparatur Kühlschrank: Ersatzteil-Frist',
    description:
      'Für Kühl- und Gefriergeräte gelten EU-Ersatzteilfristen von 7 oder 10 Jahren je nach Teil. Prüfe, bis wann dein Hersteller reparieren muss.',
    h1: 'Kühlschrank und Gefrierschrank: Bis wann muss der Hersteller reparieren?',
    intro: [
      'Ein Kühlschrank läuft rund um die Uhr, und wenn er ausfällt, wird es schnell teuer: Das Kühlgut verdirbt und ein Ersatz muss oft sofort her. Häufige Defekte sind ein kaputter Thermostat, ein Lüfter, eine defekte Elektronik oder eine verschlissene Türdichtung.',
      'Für Kühl- und Gefriergeräte schreibt die EU seit dem 1. März 2021 vor, dass Hersteller Ersatzteile über mehrere Jahre bereithalten. Seit Ende Juli 2026 knüpft das deutsche Recht daran eine Pflicht des Herstellers, auf Verlangen zu reparieren, auch nach Ablauf der Gewährleistung.',
    ],
    ruleExplanation: [
      'Für Kühl- und Gefriergeräte gilt die Verordnung (EU) 2019/2019. Je nach Ersatzteil beträgt die Frist 7 oder 10 Jahre. Weil der Check nicht weiß, welches Teil bei dir defekt ist, rechnen wir vorsichtig mit den kürzeren 7 Jahren. Bei manchen Teilen kann die Frist länger sein.',
      'Die Frist beginnt nicht mit deinem Kauf, sondern an dem Tag, an dem das letzte Gerät deines Modells in der EU in Verkehr gebracht wurde. Dieses Datum steht in der EPREL-Datenbank. Du findest den Eintrag über den QR-Code auf dem Energielabel oder über die Registriernummer.',
      'Beachte, dass die Regel für Haushaltsgeräte gilt. Gewerbliche Kühlgeräte, etwa Kühltheken, fallen unter andere Vorschriften. Wird ein Modell noch verkauft, zeigt der Check nur den frühesten Zeitpunkt, bis zu dem die Pflicht mindestens läuft.',
    ],
    startNote:
      'Die Ersatzteilpflicht für Kühl- und Gefriergeräte gilt für Modelle, die ab dem 1. März 2021 in Verkehr gebracht wurden. Ältere Modelle sind nicht erfasst.',
    example: {
      onMarketEnd: '2025-03-31',
      note: 'Dies ist ein Rechenbeispiel mit einem angenommenen Datum für das Ende des Verkaufs, kein abgerufener EPREL-Datensatz. Gerechnet wird mit der kürzeren Frist von 7 Jahren.',
    },
    faq: [
      {
        q: 'Gilt die Regel für jeden Kühlschrank?',
        a: 'Sie gilt für Haushaltskühlgeräte, deren letztes Gerät des Modells ab dem 1. März 2021 in Verkehr gebracht wurde. Weinkühlschränke und Geräte mit besonderer Bauart können ausgenommen sein.',
      },
      {
        q: 'Welche Frist gilt für welches Teil?',
        a: 'Das hängt vom Ersatzteil ab. Der Check zeigt vorsichtig die kürzere Frist von 7 Jahren. Frag den Hersteller, welche Frist für das betroffene Teil gilt.',
      },
      {
        q: 'Was ist, wenn mein Gerät noch keine zwei Jahre alt ist?',
        a: 'Dann zuerst den Verkäufer in der Gewährleistung in die Pflicht nehmen. Das ist kostenlos. Die Herstellerpflicht kommt danach in Betracht.',
      },
    ],
  },
  {
    id: 'waschtrockner',
    slug: 'waschtrockner',
    title: 'Recht auf Reparatur Waschtrockner: Frist prüfen',
    description:
      'Für Haushaltswaschtrockner gilt eine Ersatzteil- und Reparaturfrist von 10 Jahren ab dem Ende des Verkaufs. Berechne die Frist für dein Modell.',
    h1: 'Waschtrockner: Bis wann muss der Hersteller reparieren?',
    intro: [
      'Ein Waschtrockner vereint zwei Geräte in einem und hat entsprechend viele Teile, die ausfallen können: Pumpe, Heizung, Lager, Elektronik. Gerade weil die Anschaffung teuer war, lohnt sich die Frage, ob der Hersteller noch zur Reparatur verpflichtet ist.',
      'Für Haushaltswaschtrockner schreibt die EU seit dem 1. März 2021 vor, dass Hersteller Ersatzteile über einen langen Zeitraum bereithalten. Seit Ende Juli 2026 knüpft das deutsche Recht daran eine Pflicht des Herstellers, auf Verlangen zu reparieren, auch nach Ablauf der Gewährleistung des Verkäufers.',
    ],
    ruleExplanation: [
      'Für Waschtrockner gilt die Verordnung (EU) 2019/2023 mit einer Frist von 10 Jahren. Die Frist beginnt nicht mit deinem Kauf, sondern an dem Tag, an dem das letzte Gerät deines Modells in der EU in Verkehr gebracht wurde. Wer ein Modell kauft, das schon länger im Handel war, hat deshalb weniger Restzeit, als er denkt.',
      'Das Datum, an dem das letzte Gerät des Modells in Verkehr gebracht wurde, steht in der EPREL-Datenbank der Europäischen Kommission. Du findest den Eintrag über den QR-Code auf dem Energielabel oder über die Registriernummer. Gib sie auf der Startseite ein, der Check liest das Datum aus und rechnet die 10 Jahre dazu.',
      'Wird ein Modell noch verkauft, steht in EPREL kein verlässliches Ende. Dann zeigt der Check nur den frühesten Zeitpunkt, bis zu dem die Pflicht mindestens läuft: heute plus 10 Jahre. Die tatsächliche Frist kann länger sein.',
    ],
    startNote:
      'Die Ersatzteilpflicht für Waschtrockner gilt für Modelle, die ab dem 1. März 2021 in Verkehr gebracht wurden. Wurde das letzte Gerät deines Modells vorher verkauft, greift die Regel nicht.',
    example: {
      onMarketEnd: '2024-09-30',
      note: 'Dies ist ein Rechenbeispiel mit einem angenommenen Datum für das Ende des Verkaufs, kein abgerufener EPREL-Datensatz.',
    },
    faq: [
      {
        q: 'Ist ein Waschtrockner eine Waschmaschine im Sinne der Regel?',
        a: 'Waschtrockner haben in EPREL eine eigene Produktgruppe, die EU-Regeln für Ersatzteile sind aber vergleichbar. Der Check erkennt die Gruppe automatisch aus der Registriernummer.',
      },
      {
        q: 'Muss der Hersteller wirklich selbst reparieren?',
        a: 'Der Hersteller ist zur Reparatur verpflichtet, darf sie aber über Servicepartner abwickeln. Eine Ausnahme besteht, wenn die Reparatur unmöglich ist. Ob das bei dir zutrifft, kann dieser Check nicht beurteilen.',
      },
      {
        q: 'Was ist, wenn mein Gerät noch keine zwei Jahre alt ist?',
        a: 'Dann zuerst den Verkäufer in der Gewährleistung in die Pflicht nehmen. Das ist kostenlos. Die Herstellerpflicht kommt danach in Betracht.',
      },
    ],
  },
  {
    id: 'trockner',
    slug: 'trockner',
    title: 'Recht auf Reparatur Wäschetrockner: Frist prüfen',
    description:
      'Für Wäschetrockner gelten neue EU-Ersatzteilregeln seit dem 1. Juli 2025 mit 10 Jahren Frist. Berechne, bis wann dein Hersteller reparieren muss.',
    h1: 'Wäschetrockner: Bis wann muss der Hersteller reparieren?',
    intro: [
      'Bei Wäschetrocknern fallen oft Heizelement, Kondensator, Pumpe oder Sensoren aus. Anders als bei Waschmaschinen gibt es für Trockner erst seit kurzem eine EU-weite Ersatzteilregel, deshalb ist die Lage für viele Modelle noch unübersichtlich.',
      'Die neue Regel gilt für Modelle, die ab dem 1. Juli 2025 in Verkehr gebracht werden. Seit Ende Juli 2026 knüpft das deutsche Recht an solche EU-Regeln eine Pflicht des Herstellers, auf Verlangen zu reparieren, auch nach Ablauf der Gewährleistung des Verkäufers.',
    ],
    ruleExplanation: [
      'Für Wäschetrockner gilt die Verordnung (EU) 2023/2533 mit einer Frist von 10 Jahren. Die Frist beginnt an dem Tag, an dem das letzte Gerät deines Modells in der EU in Verkehr gebracht wurde, nicht mit deinem Kauf. Dieses Datum steht in der EPREL-Datenbank der Europäischen Kommission.',
      'Weil die Regel erst seit dem 1. Juli 2025 gilt, sind ältere Trockner nicht erfasst. Hast du ein Gerät, dessen Modell vorher letztmals verkauft wurde, gilt diese EU-Regel für dich nicht. Der Check meldet dann, dass die Regel für dein Modell nicht gilt, und verweist auf Gewährleistung und freiwillige Angebote.',
      'Wird ein Modell noch verkauft, zeigt der Check nur den frühesten Zeitpunkt, bis zu dem die Pflicht mindestens läuft: heute plus 10 Jahre. Die tatsächliche Frist kann länger sein.',
    ],
    startNote:
      'Die Ersatzteilpflicht für Wäschetrockner gilt erst für Modelle, die ab dem 1. Juli 2025 in Verkehr gebracht wurden. Für ältere Modelle greift sie nicht.',
    example: {
      onMarketEnd: '2025-12-31',
      note: 'Dies ist ein Rechenbeispiel mit einem angenommenen Datum für das Ende des Verkaufs, kein abgerufener EPREL-Datensatz.',
    },
    faq: [
      {
        q: 'Gilt die Regel auch für meinen älteren Trockner?',
        a: 'Nur, wenn das Modell ab dem 1. Juli 2025 in Verkehr gebracht wurde. Für ältere Geräte gibt es diese EU-Pflicht nicht. Prüfe Gewährleistung und freiwillige Herstellerangebote.',
      },
      {
        q: 'Welche Trockner sind erfasst?',
        a: 'Haushaltswäschetrockner, also Wärmepumpen-, Kondensations- und Ablufttrockner. Gewerbliche Geräte sind nicht gemeint. Der Check erkennt die Gruppe aus der Registriernummer.',
      },
      {
        q: 'Was ist, wenn mein Gerät noch keine zwei Jahre alt ist?',
        a: 'Dann zuerst den Verkäufer in der Gewährleistung in die Pflicht nehmen. Das ist kostenlos. Die Herstellerpflicht kommt danach in Betracht.',
      },
    ],
  },
  {
    id: 'fernseher-monitor',
    slug: 'fernseher-monitor',
    title: 'Recht auf Reparatur Fernseher: Ersatzteil-Frist',
    description:
      'Für Fernseher und Monitore gelten EU-Ersatzteilregeln mit 7 Jahren Frist. Prüfe, bis wann dein Hersteller reparieren muss.',
    h1: 'Fernseher und Monitor: Bis wann muss der Hersteller reparieren?',
    intro: [
      'Bei Fernsehern und Monitoren fallen häufig das Netzteil, die Hintergrundbeleuchtung, die Hauptplatine oder die Fernbedienung aus. Weil ein Ersatzgerät schnell mehrere hundert Euro kostet, lohnt sich ein Blick auf die Reparaturpflicht des Herstellers.',
      'Für elektronische Displays schreibt die EU seit dem 1. März 2021 vor, dass Hersteller Ersatzteile über mehrere Jahre bereithalten. Seit Ende Juli 2026 knüpft das deutsche Recht daran eine Pflicht des Herstellers, auf Verlangen zu reparieren, auch nach Ablauf der Gewährleistung des Verkäufers.',
    ],
    ruleExplanation: [
      'Für Fernseher und Monitore gilt die Verordnung (EU) 2019/2021. Die Frist beträgt 7 Jahre ab dem Tag, an dem das letzte Gerät deines Modells in der EU in Verkehr gebracht wurde. Sie beginnt also nicht mit deinem Kauf. Das Datum steht in der EPREL-Datenbank der Europäischen Kommission.',
      'Du findest den EPREL-Eintrag über den QR-Code auf dem Energielabel oder über die Registriernummer. Gib sie auf der Startseite ein, der Check liest das Datum aus und rechnet die 7 Jahre dazu. Ohne Nummer kannst du das Datum von Hand eingeben.',
      'Wird ein Modell noch verkauft, zeigt der Check nur den frühesten Zeitpunkt, bis zu dem die Pflicht mindestens läuft. Die tatsächliche Frist kann länger sein. Beachte, dass nicht jedes Gerät mit Bildschirm erfasst ist: Signage-Displays und manche Spezialgeräte haben eigene Regeln.',
    ],
    startNote:
      'Die Ersatzteilpflicht für elektronische Displays gilt für Modelle, die ab dem 1. März 2021 in Verkehr gebracht wurden. Ältere Modelle sind nicht erfasst.',
    example: {
      onMarketEnd: '2025-08-31',
      note: 'Dies ist ein Rechenbeispiel mit einem angenommenen Datum für das Ende des Verkaufs, kein abgerufener EPREL-Datensatz.',
    },
    faq: [
      {
        q: 'Gilt die Regel auch für Computer-Monitore?',
        a: 'Ja, elektronische Displays umfassen Fernseher und Monitore. Ob dein Modell erfasst ist, siehst du am besten in EPREL über die Registriernummer.',
      },
      {
        q: 'Muss der Hersteller wirklich selbst reparieren?',
        a: 'Der Hersteller ist zur Reparatur verpflichtet, darf sie aber über Servicepartner abwickeln. Eine Ausnahme besteht, wenn die Reparatur unmöglich ist. Ob das bei dir zutrifft, kann dieser Check nicht beurteilen.',
      },
      {
        q: 'Was ist, wenn mein Gerät noch keine zwei Jahre alt ist?',
        a: 'Dann zuerst den Verkäufer in der Gewährleistung in die Pflicht nehmen. Das ist kostenlos. Die Herstellerpflicht kommt danach in Betracht.',
      },
    ],
  },
  {
    id: 'smartphone-tablet',
    slug: 'smartphone-tablet',
    title: 'Recht auf Reparatur Smartphone: Ersatzteil-Frist',
    description:
      'Für Smartphones und Tablets gelten EU-Ersatzteilregeln seit dem 20. Juni 2025 mit 7 Jahren Frist. Prüfe, bis wann dein Hersteller reparieren muss.',
    h1: 'Smartphone und Tablet: Bis wann muss der Hersteller reparieren?',
    intro: [
      'Bei Smartphones und Tablets sind Display, Akku und Ladebuchse die häufigsten Schwachstellen. Eine Reparatur beim Hersteller ist oft teuer, deshalb ist wichtig zu wissen, wie lange er überhaupt Teile liefern und reparieren muss.',
      'Für Smartphones und Tablets gelten die EU-Ökodesign-Regeln für Modelle, die ab dem 20. Juni 2025 in Verkehr gebracht werden. Seit Ende Juli 2026 knüpft das deutsche Recht an solche EU-Regeln eine Pflicht des Herstellers, auf Verlangen zu reparieren, auch nach Ablauf der Gewährleistung des Verkäufers.',
    ],
    ruleExplanation: [
      'Für Smartphones und Tablets gilt die Verordnung (EU) 2023/1670 mit einer Frist von 7 Jahren. Die Frist beginnt an dem Tag, an dem das letzte Gerät deines Modells in der EU in Verkehr gebracht wurde, nicht mit deinem Kauf. Dieses Datum steht in der EPREL-Datenbank der Europäischen Kommission.',
      'Weil die Regel erst seit dem 20. Juni 2025 gilt, sind ältere Geräte nicht erfasst. Hast du ein Gerät, dessen Modell vorher letztmals verkauft wurde, meldet der Check, dass die Regel für dein Modell nicht gilt, und verweist auf Gewährleistung und freiwillige Angebote des Herstellers.',
      'Wird ein Modell noch verkauft, zeigt der Check nur den frühesten Zeitpunkt, bis zu dem die Pflicht mindestens läuft. Bei generalüberholten Geräten lohnt sich der Blick, ob ein Händler eigene Garantien anbietet. Die Herstellerpflicht ändert sich dadurch nicht.',
    ],
    startNote:
      'Die Ersatzteilpflicht für Smartphones und Tablets gilt für Modelle, die ab dem 20. Juni 2025 in Verkehr gebracht wurden. Für ältere Modelle greift sie nicht.',
    example: {
      onMarketEnd: '2025-10-31',
      note: 'Dies ist ein Rechenbeispiel mit einem angenommenen Datum für das Ende des Verkaufs, kein abgerufener EPREL-Datensatz.',
    },
    faq: [
      {
        q: 'Gilt die Regel für mein altes Smartphone?',
        a: 'Nur, wenn das Modell ab dem 20. Juni 2025 in Verkehr gebracht wurde. Für ältere Geräte gibt es diese EU-Pflicht nicht. Prüfe Gewährleistung und freiwillige Herstellerangebote.',
      },
      {
        q: 'Gilt die Regel auch für Tablets?',
        a: 'Ja, die Verordnung erfasst Smartphones, Tablets und auch Schnurlostelefone. Ob dein Modell erfasst ist, siehst du in EPREL über die Registriernummer.',
      },
      {
        q: 'Was ist, wenn mein Gerät noch keine zwei Jahre alt ist?',
        a: 'Dann zuerst den Verkäufer in der Gewährleistung in die Pflicht nehmen. Das ist kostenlos. Die Herstellerpflicht kommt danach in Betracht.',
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
