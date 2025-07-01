
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SuitabilityCriteria {
  id: string;
  parameter: string;
  minValue: number;
  maxValue: number;
  unit: string;
  category: 'soil' | 'climate' | 'topography' | 'water';
}

const SuitabilityCriteriaCard: React.FC = () => {
  const { toast } = useToast();
  const [criteria, setCriteria] = useState<SuitabilityCriteria[]>([
    {
      id: '1',
      parameter: 'Soil pH',
      minValue: 6.0,
      maxValue: 7.5,
      unit: 'pH',
      category: 'soil'
    },
    {
      id: '2',
      parameter: 'Annual Rainfall',
      minValue: 500,
      maxValue: 1200,
      unit: 'mm',
      category: 'climate'
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    parameter: '',
    minValue: '',
    maxValue: '',
    unit: '',
    category: 'soil' as const
  });

  const handleAddCriteria = () => {
    if (!formData.parameter || !formData.minValue || !formData.maxValue || !formData.unit) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newCriteria: SuitabilityCriteria = {
      id: Date.now().toString(),
      parameter: formData.parameter,
      minValue: parseFloat(formData.minValue),
      maxValue: parseFloat(formData.maxValue),
      unit: formData.unit,
      category: formData.category
    };

    setCriteria([...criteria, newCriteria]);
    setFormData({
      parameter: '',
      minValue: '',
      maxValue: '',
      unit: '',
      category: 'soil'
    });
    setShowForm(false);
    toast({
      title: "Success",
      description: "Suitability criteria added successfully",
    });
  };

  const handleDeleteCriteria = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
    toast({
      title: "Success",
      description: "Criteria deleted successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-lg">Suitability Criteria</CardTitle>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Criteria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Suitability Criteria</DialogTitle>
                <DialogDescription>
                  Define criteria for technology selection and recommendations
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="parameter">Parameter</Label>
                  <Input
                    id="parameter"
                    value={formData.parameter}
                    onChange={(e) => setFormData({...formData, parameter: e.target.value})}
                    placeholder="e.g., Soil pH, Slope, Temperature"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soil">Soil</SelectItem>
                      <SelectItem value="climate">Climate</SelectItem>
                      <SelectItem value="topography">Topography</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
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
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddCriteria}>
                    Add Criteria
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>Define criteria for technology selection and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        {criteria.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            No suitability criteria available. Click "Add Criteria" to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {criteria.map((criterion) => (
              <div key={criterion.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{criterion.parameter}</span>
                    <span className="text-xs bg-stone-200 px-2 py-1 rounded capitalize">
                      {criterion.category}
                    </span>
                  </div>
                  <div className="text-sm text-stone-600">
                    {criterion.minValue} - {criterion.maxValue} {criterion.unit}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCriteria(criterion.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuitabilityCriteriaCard;
