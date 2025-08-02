'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function CareerGoalsForm() {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Career Goals</CardTitle>
        <CardDescription>
          What roles are you targeting? This helps our AI provide tailored skill suggestions to bridge any gaps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="desiredJobRoles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desired Job Roles</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior Frontend Developer, Product Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
