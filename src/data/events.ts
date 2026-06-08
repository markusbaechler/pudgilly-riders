import data from './events.json';

export interface ClubEvent {
  date: string;
  dateLabel: string;
  title: string;
  location: string;
  type: 'Ausfahrt' | 'Treffen' | 'Fest' | 'Kurs';
  description: string;
}

type RawEvent = Omit<ClubEvent, 'dateLabel'>;

// Datum -> deutsches Label, z. B. "04. April 2026"
function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('de-CH', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// Inhalte werden in events.json gepflegt (auch über das CMS unter pagescms.org).
export const events: ClubEvent[] = (data as RawEvent[]).map((e) => ({
  ...e,
  dateLabel: formatDate(e.date),
}));
