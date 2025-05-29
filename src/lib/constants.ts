import type { Student } from '@/types';
import { LayoutDashboard, BrainCircuit } from 'lucide-react';
import { formatDateISO, getPastDates } from '@/lib/utils';

const today = formatDateISO(new Date());
const yesterday = formatDateISO(new Date(Date.now() - 24 * 60 * 60 * 1000));
const dayBeforeYesterday = formatDateISO(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));

// Sample attendance for 3 days
const sampleDates = getPastDates(3); // Gets [dayBeforeYesterday, yesterday, today]

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Alice Wonderland',
    attendance: {
      [sampleDates[0]]: 'present',
      [sampleDates[1]]: 'absent',
      [sampleDates[2]]: 'pending',
    },
  },
  {
    id: '2',
    name: 'Bob The Builder',
    attendance: {
      [sampleDates[0]]: 'present',
      [sampleDates[1]]: 'present',
      [sampleDates[2]]: 'pending',
    },
  },
  {
    id: '3',
    name: 'Charlie Chaplin',
    attendance: {
      [sampleDates[0]]: 'absent',
      [sampleDates[1]]: 'absent',
      [sampleDates[2]]: 'pending',
    },
  },
  {
    id: '4',
    name: 'Diana Ross',
    attendance: {
      [sampleDates[0]]: 'present',
      [sampleDates[1]]: 'pending',
      [sampleDates[2]]: 'pending',
    },
  },
  {
    id: '5',
    name: 'Edward Scissorhands',
    attendance: {
      [sampleDates[0]]: 'pending',
      [sampleDates[1]]: 'pending',
      [sampleDates[2]]: 'pending',
    },
  },
];

export const NAV_LINKS = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/intervention',
    label: 'Intervention Tool',
    icon: BrainCircuit,
  },
];
