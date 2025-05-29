'use client';
import { useState, useEffect } from 'react';
import type { Student, AttendanceStatus } from '@/types';
import { INITIAL_STUDENTS } from '@/lib/constants';
import { StudentList } from '@/components/StudentList';
import { DailySummaryCard } from '@/components/DailySummaryCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListFilter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const handleUpdateAttendance = (studentId: string, newStatus: AttendanceStatus) => {
    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id === studentId) {
          let newAbsenceCount = student.absenceCount;
          if (student.status !== 'absent' && newStatus === 'absent') {
            newAbsenceCount++;
          } else if (student.status === 'absent' && newStatus === 'present' && newAbsenceCount > 0) {
            // Optional: Decrement if changing from absent to present, but typically absence counts only go up or are reset periodically.
            // For this app, we'll just increment on marking absent.
          }
          return { ...student, status: newStatus, absenceCount: newAbsenceCount };
        }
        return student;
      })
    );
  };
  
  const filteredStudents = students
    .filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(student => statusFilter === 'all' || student.status === statusFilter);

  if (!mounted) {
    // Basic loading state or skeleton could be returned here to avoid hydration mismatch
    return <div className="flex justify-center items-center h-screen"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="space-y-6">
      <DailySummaryCard students={students} />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Student Roster</CardTitle>
          <CardDescription>Mark attendance for each student below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="w-full rounded-lg bg-background pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter Status
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={statusFilter === 'all'}
                  onCheckedChange={() => setStatusFilter('all')}
                >
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === 'present'}
                  onCheckedChange={() => setStatusFilter('present')}
                >
                  Present
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === 'absent'}
                  onCheckedChange={() => setStatusFilter('absent')}
                >
                  Absent
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === 'pending'}
                  onCheckedChange={() => setStatusFilter('pending')}
                >
                  Pending
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <StudentList students={filteredStudents} onUpdateAttendance={handleUpdateAttendance} />
        </CardContent>
      </Card>
    </div>
  );
}
