// Date helpers — keep formatting logic out of components

const LOCALE = 'es-ES';

export const DAYS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/**
 * "YYYY-MM-DD" from a Date object using LOCAL time (not UTC).
 * Avoids off-by-one errors for Spain (UTC+1/+2).
 */
export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Today's date string (local time) */
export function todayString(): string {
  return toDateString(new Date());
}

/** Format "YYYY-MM-DD" → "Lunes, 17 de marzo" */
export function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
}

/** Format "YYYY-MM-DD" → "17 mar" */
export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' });
}

/** Format "YYYY-MM-DD" → "17/03/2026" (DD/MM/YYYY español explícito) */
export function formatDateES(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Format "YYYY-MM-DD" → "Lun 17 Mar" (compact, useful in cards + showAll) */
export function formatCardDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const dayLabel = DAYS_ES[(d.getDay() + 6) % 7];
  const day = d.getDate();
  const month = MONTHS_ES[d.getMonth()].slice(0, 3);
  return `${dayLabel} ${day} ${month}`;
}

/**
 * Generate the grid cells for a full month calendar (Monday-first).
 * Returns an array whose length is always a multiple of 7.
 * Cells before the 1st and after the last day of the month are null.
 */
export function getMonthGrid(year: number, month: number): (string | null)[] {
  const firstDay = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  // Padding before: Monday=0 ... Sunday=6
  const startPad = (firstDay.getDay() + 6) % 7;

  const cells: (string | null)[] = Array(startPad).fill(null);

  for (let d = 1; d <= totalDays; d++) {
    cells.push(toDateString(new Date(year, month, d)));
  }

  // Pad end to fill the last row
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

/** Day number (1-31) */
export function getDayNumber(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDate();
}

/** Compare two date strings */
export function isSameDate(a: string, b: string): boolean {
  return a === b;
}

/** Is the given date string today? */
export function isToday(dateStr: string): boolean {
  return dateStr === todayString();
}

/** Sort comparator for reservations by time */
export function compareByTime(a: string, b: string): number {
  return a.localeCompare(b);
}
