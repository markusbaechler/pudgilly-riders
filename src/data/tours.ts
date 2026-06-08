export interface Tour {
  title: string;
  region: string;
  distance: string;
  duration: string;
  level: 'Einsteiger' | 'Fortgeschritten' | 'Profi';
  description: string;
  highlights: string[];
}

export const tours: Tour[] = [
  {
    title: 'Sustenpass-Schlaufe',
    region: 'Berner Oberland · Uri',
    distance: '210 km',
    duration: 'Tagestour',
    level: 'Fortgeschritten',
    description:
      'Klassiker über den Susten mit endlosen Kehren, Gletscherblick und einer Pause am Steingletscher.',
    highlights: ['Sustenpass', 'Steingletscher', 'Innertkirchen'],
  },
  {
    title: 'Jura-Höhenweg',
    region: 'Solothurn · Jura',
    distance: '160 km',
    duration: 'Halbtagestour',
    level: 'Einsteiger',
    description:
      'Entspannte Runde über fliessende Jurahöhen – perfekt für den Saisonstart und neue Mitglieder.',
    highlights: ['Weissenstein', 'Balsthal', 'Aussichtspunkt Hasenmatt'],
  },
  {
    title: 'Drei-Pässe-Fahrt',
    region: 'Graubünden',
    distance: '320 km',
    duration: '2 Tage',
    level: 'Profi',
    description:
      'Flüela, Albula und Julier an einem Wochenende. Hochalpin, anspruchsvoll und ein Fest für jeden Töfffahrer.',
    highlights: ['Flüelapass', 'Albulapass', 'Julierpass', 'Übernachtung Davos'],
  },
  {
    title: 'Seenrunde Tessin',
    region: 'Tessin',
    distance: '240 km',
    duration: 'Tagestour',
    level: 'Fortgeschritten',
    description:
      'Südliches Flair zwischen Lago Maggiore und Luganersee mit mediterraner Mittagspause.',
    highlights: ['Lago Maggiore', 'Monte Ceneri', 'Lugano'],
  },
  {
    title: 'Emmental-Genussfahrt',
    region: 'Emmental',
    distance: '130 km',
    duration: 'Halbtagestour',
    level: 'Einsteiger',
    description:
      'Sanfte Hügel, kurvige Nebenstrassen und ein Halt bei der Schaukäserei. Genuss statt Tempo.',
    highlights: ['Lueg', 'Schaukäserei', 'Lützelflüh'],
  },
  {
    title: 'Grimsel & Furka',
    region: 'Wallis · Uri',
    distance: '280 km',
    duration: 'Tagestour',
    level: 'Profi',
    description:
      'Die Königsetappe: Grimsel und Furka im Doppelpack, garniert mit dem Rhonegletscher.',
    highlights: ['Grimselpass', 'Furkapass', 'Rhonegletscher', 'Gletsch'],
  },
];
