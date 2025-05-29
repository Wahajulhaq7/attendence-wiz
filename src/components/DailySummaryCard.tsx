import type { Student } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, UserCheck, UserX } from 'lucide-react';

interface DailySummaryCardProps {
  students: Student[];
}

export function DailySummaryCard({ students }: DailySummaryCardProps) {
  const totalStudents = students.length;
  const presentStudents = students.filter(s => s.status === 'present').length;
  const absentStudents = students.filter(s => s.status === 'absent').length;
  const pendingStudents = students.filter(s => s.status === 'pending').length;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Users className="h-7 w-7 text-primary" />
          Daily Attendance Summary
        </CardTitle>
        <CardDescription>Overview for {new Date().toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg bg-green-100 dark:bg-green-900/50 p-4">
          <UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{presentStudents}</p>
            <p className="text-sm text-muted-foreground">Present</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-red-100 dark:bg-red-900/50 p-4">
          <UserX className="h-8 w-8 text-red-600 dark:text-red-400" />
          <div>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{absentStudents}</p>
            <p className="text-sm text-muted-foreground">Absent</p>
          </div>
        </div>
         <div className="flex items-center gap-3 rounded-lg bg-amber-100 dark:bg-amber-900/50 p-4">
          <Users className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{pendingStudents}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
