import data from './events.json';

export interface ClubEvent {
  date: string;
  dateLabel: string;
  title: string;
  location: string;
  type: 'Ausfahrt' | 'Treffen' | 'Fest' | 'Kurs';
  description?: string;
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

// Heutiges Datum in der Schweiz als "JJJJ-MM-TT".
// Wichtig, weil der Build bei GitHub in UTC läuft.
function todayInSwitzerland(): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Zurich',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

const today = todayInSwitzerland();

// Alle Events aus events.json (gepflegt im CMS), nach Datum sortiert.
export const events: ClubEvent[] = (data as RawEvent[])
  .map((e) => ({ ...e, dateLabel: formatDate(e.date) }))
  .sort((a, b) => a.date.localeCompare(b.date));

// Kommende Termine (heute eingeschlossen) – das zeigt die Startseite.
export const upcomingEvents: ClubEvent[] = events.filter((e) => e.date >= today);

// Vergangene Termine, neueste zuerst – Rückblick auf der Events-Seite.
export const pastEvents: ClubEvent[] = events.filter((e) => e.date < today).reverse();
