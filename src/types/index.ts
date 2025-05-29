
export type AttendanceStatus = 'present' | 'absent' | 'pending';

export interface StudentAttendance {
  [date: string]: AttendanceStatus; // date in "YYYY-MM-DD" format
}

export interface Student {
  id: string;
  name: string;
  attendance: StudentAttendance;
  // The 'status' and 'absenceCount' fields are removed
  // as status is now per-date and absenceCount will be calculated.
}
