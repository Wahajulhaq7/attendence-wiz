
export type AttendanceStatus = 'present' | 'absent' | 'pending';

export interface Student {
  id: string;
  name: string;
  status: AttendanceStatus;
  absenceCount: number;
}
