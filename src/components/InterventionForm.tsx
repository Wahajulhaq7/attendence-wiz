
'use client';
import { useState, useEffect } from 'react';
import type { Student } from '@/types';
import { suggestIntervention, type SuggestInterventionInput } from '@/ai/flows/suggest-intervention';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, Loader2, WandSparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface InterventionFormProps {
  students: Student[];
  calculateTotalAbsences: (student: Student) => number;
}

export function InterventionForm({ students: allStudents, calculateTotalAbsences }: InterventionFormProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [absenceRecordText, setAbsenceRecordText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (allStudents.length > 0) {
      // Pre-select first student with absences if available, otherwise first student
      const studentWithAbsences = allStudents.find(s => calculateTotalAbsences(s) > 0);
      const studentToSelect = studentWithAbsences || allStudents[0];
      if (studentToSelect) {
        setSelectedStudentId(studentToSelect.id);
        updateAbsenceRecordDisplay(studentToSelect);
      }
    }
  }, [allStudents, calculateTotalAbsences]);

  const updateAbsenceRecordDisplay = (student: Student | undefined) => {
    if (student) {
      const totalAbsences = calculateTotalAbsences(student);
      const record = totalAbsences > 0 
        ? `${student.name} has ${totalAbsences} recorded absence${totalAbsences > 1 ? 's' : ''} in total. Consider potential reasons and patterns.`
        : `${student.name} currently has no recorded absences. This tool is most effective for students with existing attendance concerns.`;
      setAbsenceRecordText(record);
    } else {
      setAbsenceRecordText('');
    }
  };

  const handleStudentChange = (studentId: string) => {
    setSelectedStudentId(studentId);
    const student = allStudents.find(s => s.id === studentId);
    updateAbsenceRecordDisplay(student);
    setSuggestions([]); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast({
        title: 'Error',
        description: 'Please select a student.',
        variant: 'destructive',
      });
      return;
    }

    const student = allStudents.find(s => s.id === selectedStudentId);
    if (!student) {
      toast({
        title: 'Error',
        description: 'Selected student not found.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSuggestions([]);

    try {
      // The AI flow expects a general 'absenceRecord', so we use the display text.
      const input: SuggestInterventionInput = {
        studentName: student.name,
        absenceRecord: absenceRecordText, 
      };
      const result = await suggestIntervention(input);
      setSuggestions(result.interventionSuggestions);
      toast({
        title: 'Suggestions Generated!',
        description: `Found ${result.interventionSuggestions.length} ideas for ${student.name}.`,
      });
    } catch (error) {
      console.error('Error suggesting intervention:', error);
      toast({
        title: 'AI Error',
        description: 'Could not generate suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedStudent = allStudents.find(s => s.id === selectedStudentId);

  if (!mounted) {
     return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading intervention tool...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BrainCircuit className="h-7 w-7 text-primary" />
          Absence Intervention Tool
        </CardTitle>
        <CardDescription>
          Get AI-powered suggestions for students with attendance concerns.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="student-select">Student</Label>
            <Select value={selectedStudentId} onValueChange={handleStudentChange}>
              <SelectTrigger id="student-select" aria-label="Select student">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {allStudents.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} (Total Absences: {calculateTotalAbsences(s)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="absence-record">Absence Record Summary (Auto-generated)</Label>
            <Textarea
              id="absence-record"
              value={absenceRecordText}
              readOnly
              rows={3}
              className="bg-muted/50 border-dashed"
              aria-label="Absence record details for the selected student"
            />
             <p className="text-xs text-muted-foreground">
              This summary is based on the student's overall attendance. The AI will use this to generate suggestions.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !selectedStudentId} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <WandSparkles className="mr-2 h-4 w-4" />
            )}
            Generate Suggestions
          </Button>
        </CardFooter>
      </form>

      {suggestions.length > 0 && (
        <div className="p-6 pt-0">
        <Alert variant="default" className="bg-primary/10 border-primary/30">
          <WandSparkles className="h-5 w-5 !text-primary" />
          <AlertTitle className="text-primary font-semibold">Intervention Suggestions for {selectedStudent?.name}</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
        </div>
      )}
    </Card>
  );
}
