'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function CertificationsForm() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">Certifications</CardTitle>
        <CardDescription>List any professional certifications you have obtained.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((item, index) => (
          <div key={item.id} className="p-4 border rounded-lg relative space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name={`certifications.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certification Name</FormLabel>
                    <FormControl><Input placeholder="e.g., AWS Certified Developer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`certifications.${index}.issuingOrganization`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issuing Organization</FormLabel>
                    <FormControl><Input placeholder="e.g., Amazon Web Services" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`certifications.${index}.issueDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl><Input placeholder="e.g., March 2023" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`certifications.${index}.expirationDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Date (Optional)</FormLabel>
                    <FormControl><Input placeholder="e.g., March 2025" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
          onClick={() => append({ name: '', issuingOrganization: '', issueDate: '', expirationDate: '' })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Certification
        </Button>
      </CardContent>
    </Card>
  );
}
