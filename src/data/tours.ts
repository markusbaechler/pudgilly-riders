import data from './tours.json';

export interface Tour {
  title: string;
  region: string;
  distance: string;
  duration: string;
  level: 'Einsteiger' | 'Fortgeschritten' | 'Profi';
  description: string;
  highlights: string[];
}

// Inhalte werden in tours.json gepflegt (auch über das CMS unter pagescms.org).
export const tours: Tour[] = data as Tour[];
