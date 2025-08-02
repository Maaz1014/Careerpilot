'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';

export function SkillsForm() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Skills</CardTitle>
        <CardDescription>List your technical and soft skills. This helps us match you with job requirements.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fields.map((item, index) => (
            <FormField
                key={item.id}
                control={control}
                name={`skills.${index}.name`}
                render={({ field }) => (
                <FormItem>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Input placeholder="e.g., React" {...field} />
                        </FormControl>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            >
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                    <FormMessage />
                </FormItem>
                )}
            />
            ))}
        </div>
        <Separator className="my-6" />
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: '' })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </CardContent>
    </Card>
  );
}
