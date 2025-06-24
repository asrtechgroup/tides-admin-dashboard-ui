
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TechSpecification } from '@/types/irrigation';

const specificationSchema = z.object({
  parameter: z.string().min(1, 'Parameter is required'),
  value: z.string().min(1, 'Value is required'),
  unit: z.string().min(1, 'Unit is required'),
  description: z.string().min(1, 'Description is required'),
});

interface SpecificationFormProps {
  specification?: TechSpecification;
  onSubmit: (data: z.infer<typeof specificationSchema>) => void;
  onCancel: () => void;
}

const SpecificationForm: React.FC<SpecificationFormProps> = ({ specification, onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof specificationSchema>>({
    resolver: zodResolver(specificationSchema),
    defaultValues: {
      parameter: specification?.parameter || '',
      value: specification?.value || '',
      unit: specification?.unit || '',
      description: specification?.description || '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{specification ? 'Edit Specification' : 'Add New Specification'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="parameter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parameter</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Flow Rate, Pressure" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter parameter value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., L/h, bar, mm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter parameter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {specification ? 'Update' : 'Add'} Specification
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SpecificationForm;
