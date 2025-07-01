
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface SuitabilityCriterion {
  id: string;
  name: string;
  category: 'soil' | 'climate' | 'topography' | 'water' | 'crop';
  minValue?: number;
  maxValue?: number;
  unit?: string;
  allowedValues?: string[];
  weight: number;
  description: string;
}

interface SuitabilityTabContentProps {
  criteria: SuitabilityCriterion[];
  showCriteriaForm: boolean;
  editingCriterion?: SuitabilityCriterion;
  onShowForm: () => void;
  onEdit: (criterion: SuitabilityCriterion) => void;
  onDelete: (id: string) => void;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SuitabilityTabContent: React.FC<SuitabilityTabContentProps> = ({
  criteria,
  showCriteriaForm,
  editingCriterion,
  onShowForm,
  onEdit,
  onDelete,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'soil' as 'soil' | 'climate' | 'topography' | 'water' | 'crop',
    minValue: '',
    maxValue: '',
    unit: '',
    allowedValues: '',
    weight: '1',
    description: ''
  });

  React.useEffect(() => {
    if (editingCriterion) {
      setFormData({
        name: editingCriterion.name,
        category: editingCriterion.category,
        minValue: editingCriterion.minValue?.toString() || '',
        maxValue: editingCriterion.maxValue?.toString() || '',
        unit: editingCriterion.unit || '',
        allowedValues: editingCriterion.allowedValues?.join(', ') || '',
        weight: editingCriterion.weight.toString(),
        description: editingCriterion.description
      });
    } else {
      setFormData({
        name: '',
        category: 'soil',
        minValue: '',
        maxValue: '',
        unit: '',
        allowedValues: '',
        weight: '1',
        description: ''
      });
    }
  }, [editingCriterion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast.error('Please fill in required fields');
      return;
    }

    const criterionData = {
      name: formData.name,
      category: formData.category,
      minValue: formData.minValue ? parseFloat(formData.minValue) : undefined,
      maxValue: formData.maxValue ? parseFloat(formData.maxValue) : undefined,
      unit: formData.unit || undefined,
      allowedValues: formData.allowedValues ? formData.allowedValues.split(',').map(v => v.trim()) : undefined,
      weight: parseFloat(formData.weight),
      description: formData.description
    };

    onSubmit(criterionData);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      soil: 'bg-amber-100 text-amber-800',
      climate: 'bg-blue-100 text-blue-800',
      topography: 'bg-green-100 text-green-800',
      water: 'bg-cyan-100 text-cyan-800',
      crop: 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-orange-600" />
              <CardTitle>Suitability Criteria</CardTitle>
            </div>
            <Dialog open={showCriteriaForm} onOpenChange={(open) => open ? onShowForm() : onCancel()}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Criteria
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingCriterion ? 'Edit Criteria' : 'Add Suitability Criteria'}
                  </DialogTitle>
                  <DialogDescription>
                    Define criteria for technology selection and recommendations
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Criteria Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Soil pH, Slope, Temperature"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value: 'soil' | 'climate' | 'topography' | 'water' | 'crop') => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="soil">Soil</SelectItem>
                        <SelectItem value="climate">Climate</SelectItem>
                        <SelectItem value="topography">Topography</SelectItem>
                        <SelectItem value="water">Water</SelectItem>
                        <SelectItem value="crop">Crop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minValue">Min Value</Label>
                      <Input
                        id="minValue"
                        type="number"
                        value={formData.minValue}
                        onChange={(e) => setFormData({...formData, minValue: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxValue">Max Value</Label>
                      <Input
                        id="maxValue"
                        type="number"
                        value={formData.maxValue}
                        onChange={(e) => setFormData({...formData, maxValue: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      placeholder="e.g., pH, mm, °C, %"
                    />
                  </div>

                  <div>
                    <Label htmlFor="allowedValues">Allowed Values (comma-separated)</Label>
                    <Input
                      id="allowedValues"
                      value={formData.allowedValues}
                      onChange={(e) => setFormData({...formData, allowedValues: e.target.value})}
                      placeholder="e.g., clay, loam, sandy"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight">Weight (1-10)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe the criteria..."
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCriterion ? 'Update' : 'Add'} Criteria
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Define criteria for technology selection and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {criteria.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-stone-300" />
              <p className="text-lg font-medium">No suitability criteria available</p>
              <p className="text-sm">Click "Add Criteria" to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Range/Values</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteria.map((criterion) => (
                  <TableRow key={criterion.id}>
                    <TableCell className="font-medium">{criterion.name}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(criterion.category)}>
                        {criterion.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {criterion.minValue !== undefined && criterion.maxValue !== undefined ? (
                        `${criterion.minValue} - ${criterion.maxValue}${criterion.unit ? ` ${criterion.unit}` : ''}`
                      ) : criterion.allowedValues ? (
                        criterion.allowedValues.join(', ')
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{criterion.weight}</TableCell>
                    <TableCell className="max-w-xs truncate">{criterion.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(criterion)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(criterion.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuitabilityTabContent;
