
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
import { IrrigationTechnology } from '@/types/irrigation';

const technologySchema = z.object({
  name: z.string().min(1, 'Technology name is required'),
  type: z.enum(['drip', 'sprinkler', 'micro-spray', 'surface', 'subsurface']),
  description: z.string().min(1, 'Description is required'),
  efficiency: z.number().min(0).max(100, 'Efficiency must be between 0-100%'),
  waterRequirement: z.number().min(0, 'Water requirement must be positive'),
  maintenanceLevel: z.enum(['low', 'medium', 'high']),
  lifespan: z.number().min(1, 'Lifespan must be at least 1 year'),
});

interface TechnologyFormProps {
  technology?: IrrigationTechnology;
  onSubmit: (data: z.infer<typeof technologySchema>) => void;
  onCancel: () => void;
}

const TechnologyForm: React.FC<TechnologyFormProps> = ({ technology, onSubmit, onCancel }) => {
  const form = useForm<z.infer<typeof technologySchema>>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: technology?.name || '',
      type: technology?.type || 'drip',
      description: technology?.description || '',
      efficiency: technology?.efficiency || 0,
      waterRequirement: technology?.waterRequirement || 0,
      maintenanceLevel: technology?.maintenanceLevel || 'medium',
      lifespan: technology?.lifespan || 10,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{technology ? 'Edit Technology' : 'Add New Technology'}</CardTitle>
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
                    <FormLabel>Technology Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter technology name" {...field} />
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
                        <SelectItem value="drip">Drip Irrigation</SelectItem>
                        <SelectItem value="sprinkler">Sprinkler</SelectItem>
                        <SelectItem value="micro-spray">Micro Spray</SelectItem>
                        <SelectItem value="surface">Surface Irrigation</SelectItem>
                        <SelectItem value="subsurface">Subsurface</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="efficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Efficiency (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter efficiency percentage"
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
                name="waterRequirement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water Requirement (L/m²/day)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter water requirement"
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
                name="maintenanceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select maintenance level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lifespan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lifespan (years)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter lifespan"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
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
                    <Input placeholder="Enter technology description" {...field} />
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
                {technology ? 'Update' : 'Add'} Technology
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TechnologyForm;
