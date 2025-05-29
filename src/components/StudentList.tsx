'use client';
import type { Student, AttendanceStatus } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, CircleHelp, UserCheck, UserX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudentListProps {
  students: Student[];
  onUpdateAttendance: (studentId: string, status: AttendanceStatus) => void;
}

const statusIcons = {
  present: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  absent: <XCircle className="h-5 w-5 text-red-500" />,
  pending: <CircleHelp className="h-5 w-5 text-amber-500" />,
};

const statusBadgeVariants = {
  present: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
  absent: 'bg-red-100 text-red-700 hover:bg-red-200 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700',
  pending: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700',
};


export function StudentList({ students, onUpdateAttendance }: StudentListProps) {
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <div className="overflow-hidden rounded-lg border shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[80px] hidden sm:table-cell">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Absence Count</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No students to display.
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="hidden sm:table-cell">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={`https://placehold.co/40x40.png?text=${getInitials(student.name)}`} alt={student.name} data-ai-hint="avatar person" />
                    <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={cn("capitalize", statusBadgeVariants[student.status])}>
                    {statusIcons[student.status]}
                    <span className="ml-2">{student.status}</span>
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{student.absenceCount}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateAttendance(student.id, 'present')}
                    disabled={student.status === 'present'}
                    className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white disabled:opacity-70"
                  >
                    <UserCheck className="mr-1 h-4 w-4" /> Present
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateAttendance(student.id, 'absent')}
                    disabled={student.status === 'absent'}
                    className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white disabled:opacity-70"
                  >
                    <UserX className="mr-1 h-4 w-4" /> Absent
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
