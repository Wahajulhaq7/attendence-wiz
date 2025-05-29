'use client';
// This page must be a client component to manage student data for the form.
// In a real app, this data might come from a global state or API.
import { useState, useEffect } from 'react';
import { InterventionForm } from '@/components/InterventionForm';
import { INITIAL_STUDENTS } from '@/lib/constants'; // Using the same initial students for now
import type { Student } from '@/types';

export default function InterventionPage() {
  // For simplicity, we use the same initial student data.
  // A real app would likely fetch this or use a state management solution.
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Here you could fetch updated student data if needed
    // For this example, we'll stick to the initial data passed to the form.
  }, []);

  if (!mounted) {
    return <div className="flex justify-center items-center h-screen"><p>Loading intervention tool...</p></div>;
  }

  return (
    <div className="container mx-auto py-8">
      <InterventionForm students={students} />
    </div>
  );
}
