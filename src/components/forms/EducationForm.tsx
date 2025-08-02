'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function EducationForm() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Education</CardTitle>
        <CardDescription>Tell us about your academic background. Add all relevant degrees and institutions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((item, index) => (
          <div key={item.id} className="p-4 border rounded-lg relative space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`education.${index}.institution`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl><Input placeholder="e.g., University of California" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.degree`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl><Input placeholder="e.g., Bachelor of Science" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.major`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major</FormLabel>
                    <FormControl><Input placeholder="e.g., Computer Science" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`education.${index}.graduationDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Graduation Date</FormLabel>
                    <FormControl><Input placeholder="e.g., May 2024" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={control}
                name={`education.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="Relevant coursework, achievements, GPA, etc." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
         <Separator />
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ institution: '', degree: '', major: '', graduationDate: '', description: '' })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Education
        </Button>
      </CardContent>
    </Card>
  );
}
