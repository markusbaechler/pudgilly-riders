export interface ClubEvent {
  date: string;
  dateLabel: string;
  title: string;
  location: string;
  type: 'Ausfahrt' | 'Treffen' | 'Fest' | 'Kurs';
  description: string;
}

export const events: ClubEvent[] = [
  {
    date: '2026-04-04',
    dateLabel: '04. April 2026',
    title: 'Saisoneröffnung & Anlassfahrt',
    location: 'Clubhaus → Weissenstein',
    type: 'Ausfahrt',
    description:
      'Gemeinsamer Saisonstart mit Bikesegnung, kurzer Ausfahrt und Apéro im Clubhaus.',
  },
  {
    date: '2026-05-16',
    dateLabel: '16. Mai 2026',
    title: 'Fahrsicherheitstraining',
    location: 'Verkehrssicherheitszentrum',
    type: 'Kurs',
    description:
      'Bremsen, Kurventechnik und Notmanöver unter Anleitung – für alle Levels empfohlen.',
  },
  {
    date: '2026-06-20',
    dateLabel: '20. Juni 2026',
    title: 'Drei-Pässe-Wochenende',
    location: 'Graubünden',
    type: 'Ausfahrt',
    description:
      'Zweitägige Tour über Flüela, Albula und Julier mit Übernachtung in Davos.',
  },
  {
    date: '2026-08-08',
    dateLabel: '08. August 2026',
    title: 'Sommerfest & Grillabend',
    location: 'Clubhaus',
    type: 'Fest',
    description:
      'Offenes Clubfest mit Grill, Live-Musik und Bike-Show. Gäste herzlich willkommen.',
  },
  {
    date: '2026-09-12',
    dateLabel: '12. September 2026',
    title: 'Stammtisch',
    location: 'Restaurant Rössli',
    type: 'Treffen',
    description:
      'Monatlicher Stammtisch – Touren planen, Benzin im Blut und gute Gespräche.',
  },
  {
    date: '2026-10-17',
    dateLabel: '17. Oktober 2026',
    title: 'Saisonabschlussfahrt',
    location: 'Clubhaus → Emmental',
    type: 'Ausfahrt',
    description:
      'Letzte gemeinsame Runde der Saison mit anschliessendem Käsefondue.',
  },
];
