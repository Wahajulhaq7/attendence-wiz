
'use client';
import { useState, useEffect, useMemo } from 'react';
import type { Student, AttendanceStatus } from '@/types';
import { INITIAL_STUDENTS } from '@/lib/constants';
import { StudentList } from '@/components/StudentList';
import { DailySummaryCard } from '@/components/DailySummaryCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListFilter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDateISO, getNextDay, getPreviousDay, calculateTotalAbsences } from '@/lib/utils';
import { format as formatDateFns, parseISO } from 'date-fns';


export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>(formatDateISO(new Date()));

  useEffect(() => {
    setMounted(true);
    // Ensure all students have an attendance entry for the current date, defaulting to 'pending'
    setStudents(prevStudents =>
      prevStudents.map(student => {
        const newAttendance = { ...student.attendance };
        if (!newAttendance[currentDate]) {
          newAttendance[currentDate] = 'pending';
        }
        return { ...student, attendance: newAttendance };
      })
    );
  }, [currentDate]); // Rerun if currentDate changes

  const handleUpdateAttendance = (studentId: string, newStatus: AttendanceStatus, date: string) => {
    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.id === studentId) {
          const updatedAttendance = { ...student.attendance, [date]: newStatus };
          return { ...student, attendance: updatedAttendance };
        }
        return student;
      })
    );
  };
  
  const filteredStudents = useMemo(() => {
    return students
    .filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(student => {
      if (statusFilter === 'all') return true;
      return student.attendance[currentDate] === statusFilter;
    });
  }, [students, searchTerm, statusFilter, currentDate]);

  const handlePreviousDay = () => {
    setCurrentDate(getPreviousDay(currentDate));
  };

  const handleNextDay = () => {
    const today = formatDateISO(new Date());
    const nextDay = getNextDay(currentDate);
    // Prevent navigating to future dates beyond today
    if (parseISO(nextDay) <= parseISO(today)) {
      setCurrentDate(nextDay);
    }
  };

  const isToday = useMemo(() => formatDateISO(new Date()) === currentDate, [currentDate]);

  if (!mounted) {
    return <div className="flex justify-center items-center h-screen"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DailySummaryCard students={students} currentDate={currentDate} />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium tabular-nums">
            {formatDateFns(parseISO(currentDate), 'EEE, MMM d, yyyy')}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextDay} disabled={isToday}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Student Roster</CardTitle>
          <CardDescription>
            Mark attendance for each student for {formatDateFns(parseISO(currentDate), 'MMMM d, yyyy')}.
          </CardDescription>
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
                <DropdownMenuLabel>Filter by status for {formatDateFns(parseISO(currentDate), 'MMM d')}</DropdownMenuLabel>
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
          <StudentList 
            students={filteredStudents} 
            currentDate={currentDate}
            onUpdateAttendance={handleUpdateAttendance} 
            calculateTotalAbsences={calculateTotalAbsences}
          />
        </CardContent>
      </Card>
    </div>
  );
}
