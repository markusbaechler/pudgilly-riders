import data from './events.json';

export interface ClubEvent {
  date: string;
  /** Enddatum bei mehrtägigen Terminen (optional) */
  endDate?: string;
  dateLabel: string;
  title: string;
  location?: string;
  type: 'Ausfahrt' | 'Treffen' | 'Fest' | 'Kurs';
  description?: string;
}

type RawEvent = Omit<ClubEvent, 'dateLabel'>;

const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

// "2027-05-15" -> { day: "15", month: "Mai", year: "2027" }
function parts(iso: string) {
  const [y, m, d] = iso.split('-');
  return { day: d, month: MONTHS[Number(m) - 1] ?? m, year: y };
}

// Datum oder Datumsbereich -> deutsches Label:
//   "04. April 2026" · "15.–17. Mai 2027" · "30. September – 02. Oktober 2027"
export function formatDateRange(start: string, end?: string): string {
  const a = parts(start);
  if (!end || end <= start) return `${a.day}. ${a.month} ${a.year}`;
  const b = parts(end);
  if (a.year === b.year && a.month === b.month) return `${a.day}.–${b.day}. ${b.month} ${b.year}`;
  if (a.year === b.year) return `${a.day}. ${a.month} – ${b.day}. ${b.month} ${b.year}`;
  return `${a.day}. ${a.month} ${a.year} – ${b.day}. ${b.month} ${b.year}`;
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

// Letzter Tag eines Termins (bei mehrtägigen das Enddatum)
const lastDay = (e: RawEvent) => (e.endDate && e.endDate > e.date ? e.endDate : e.date);

// Alle Events aus events.json (gepflegt im CMS), nach Datum sortiert.
export const events: ClubEvent[] = (data as RawEvent[])
  .map((e) => ({ ...e, dateLabel: formatDateRange(e.date, e.endDate) }))
  .sort((a, b) => a.date.localeCompare(b.date));

// Kommende Termine (laufende mehrtägige eingeschlossen) – das zeigt die Startseite.
export const upcomingEvents: ClubEvent[] = events.filter((e) => lastDay(e) >= today);

// Vergangene Termine, neueste zuerst – Rückblick auf der Events-Seite.
export const pastEvents: ClubEvent[] = events.filter((e) => lastDay(e) < today).reverse();
