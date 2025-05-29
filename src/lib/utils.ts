import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, subDays, addDays, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a Date object or a date string into "YYYY-MM-DD" format.
 * @param date The date to format.
 * @returns The formatted date string.
 */
export function formatDateISO(date: Date | string): string {
  if (typeof date === 'string') {
    return format(parseISO(date), 'yyyy-MM-dd');
  }
  return format(date, 'yyyy-MM-dd');
}

/**
 * Gets an array of date strings in "YYYY-MM-DD" format for the past number of days.
 * @param numDays The number of past days to get dates for (including today).
 * @returns An array of formatted date strings.
 */
export function getPastDates(numDays: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < numDays; i++) {
    dates.push(formatDateISO(subDays(today, i)));
  }
  return dates.reverse(); // today will be the last element
}

/**
 * Gets the next day in "YYYY-MM-DD" format.
 * @param currentDateString The current date string in "YYYY-MM-DD".
 * @returns The next day as a formatted date string.
 */
export function getNextDay(currentDateString: string): string {
  const currentDate = parseISO(currentDateString);
  return formatDateISO(addDays(currentDate, 1));
}

/**
 * Gets the previous day in "YYYY-MM-DD" format.
 * @param currentDateString The current date string in "YYYY-MM-DD".
 * @returns The previous day as a formatted date string.
 */
export function getPreviousDay(currentDateString: string): string {
  const currentDate = parseISO(currentDateString);
  return formatDateISO(subDays(currentDate, 1));
}

/**
 * Calculates the total number of absences for a student.
 * @param student The student object.
 * @returns The total number of absences.
 */
export function calculateTotalAbsences(student: Student): number {
  return Object.values(student.attendance).filter(status => status === 'absent').length;
}
