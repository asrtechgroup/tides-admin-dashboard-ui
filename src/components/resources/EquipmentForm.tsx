
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Equipment } from '@/types/resources';

const equipmentSchema = z.object({
  name: z.string().min(1, 'Equipment name is required'),
  type: z.enum(['excavator', 'trencher', 'pump', 'generator', 'compactor', 'other']),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
  dailyRate: z.number().min(0, 'Daily rate must be positive'),
  operator: z.boolean(),
  fuelConsumption: z.number().min(0, 'Fuel consumption must be positive'),
});

interface EquipmentFormProps {
  equipment?: Equipment;
  onSubmit: (data: z.infer<typeof equipmentSchema>) => void;
  onCancel: () => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ equipment, onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof equipmentSchema>>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: equipment?.name || '',
      type: equipment?.type || 'excavator',
      hourlyRate: equipment?.hourlyRate || 0,
      dailyRate: equipment?.dailyRate || 0,
      operator: equipment?.operator || false,
      fuelConsumption: equipment?.fuelConsumption || 0,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{equipment ? 'Edit Equipment' : 'Add New Equipment'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter equipment name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="excavator">Excavator</SelectItem>
                        <SelectItem value="trencher">Trencher</SelectItem>
                        <SelectItem value="pump">Pump</SelectItem>
                        <SelectItem value="generator">Generator</SelectItem>
                        <SelectItem value="compactor">Compactor</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate (TSH)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter hourly rate"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dailyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Rate (TSH)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter daily rate"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelConsumption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Consumption (L/hr)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter fuel consumption"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operator"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Requires Operator</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {equipment ? 'Update' : 'Add'} Equipment
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EquipmentForm;
