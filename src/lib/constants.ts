import type { Student } from '@/types';
import { LayoutDashboard, MessageSquarePlus, BrainCircuit } from 'lucide-react'; // Added BrainCircuit

export const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Alice Wonderland', status: 'pending', absenceCount: 2 },
  { id: '2', name: 'Bob The Builder', status: 'pending', absenceCount: 0 },
  { id: '3', name: 'Charlie Chaplin', status: 'pending', absenceCount: 5 },
  { id: '4', name: 'Diana Ross', status: 'pending', absenceCount: 1 },
  { id: '5', name: 'Edward Scissorhands', status: 'pending', absenceCount: 0 },
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
    icon: BrainCircuit, // Using BrainCircuit for AI/Intervention
  },
];
