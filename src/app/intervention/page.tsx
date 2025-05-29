
'use client';
import { useState, useEffect } from 'react';
import { InterventionForm } from '@/components/InterventionForm';
import { INITIAL_STUDENTS } from '@/lib/constants'; 
import type { Student } from '@/types';
import { calculateTotalAbsences } from '@/lib/utils';

export default function InterventionPage() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // In a real app, student data might be fetched or come from a global state.
    // For now, we're using INITIAL_STUDENTS which now has the new 'attendance' structure.
    // The InterventionForm will calculate total absences from this structure.
  }, []);

  if (!mounted) {
    return <div className="flex justify-center items-center h-screen"><p>Loading intervention tool...</p></div>;
  }

  return (
    <div className="container mx-auto py-8">
      <InterventionForm students={students} calculateTotalAbsences={calculateTotalAbsences} />
    </div>
  );
}
