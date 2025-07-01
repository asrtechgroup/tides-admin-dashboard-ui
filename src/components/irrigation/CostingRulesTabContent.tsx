
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Calculator, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { CostingRule } from '@/types/irrigation';

interface CostingRulesTabContentProps {
  costingRules: CostingRule[];
  showCostingForm: boolean;
  editingCostingRule?: CostingRule;
  onShowForm: () => void;
  onEdit: (rule: CostingRule) => void;
  onDelete: (id: string) => void;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CostingRulesTabContent: React.FC<CostingRulesTabContentProps> = ({
  costingRules,
  showCostingForm,
  editingCostingRule,
  onShowForm,
  onEdit,
  onDelete,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    component: '',
    costPerUnit: '',
    unit: '',
    formula: '',
    factors: ''
  });

  React.useEffect(() => {
    if (editingCostingRule) {
      setFormData({
        component: editingCostingRule.component,
        costPerUnit: editingCostingRule.costPerUnit.toString(),
        unit: editingCostingRule.unit,
        formula: editingCostingRule.formula,
        factors: editingCostingRule.factors.join(', ')
      });
    } else {
      setFormData({
        component: '',
        costPerUnit: '',
        unit: '',
        formula: '',
        factors: ''
      });
    }
  }, [editingCostingRule]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.component || !formData.costPerUnit || !formData.unit || !formData.formula) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ruleData = {
      component: formData.component,
      costPerUnit: parseFloat(formData.costPerUnit),
      unit: formData.unit,
      formula: formData.formula,
      factors: formData.factors ? formData.factors.split(',').map(f => f.trim()) : []
    };

    onSubmit(ruleData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-green-600" />
              <CardTitle>Costing Rules</CardTitle>
            </div>
            <Dialog open={showCostingForm} onOpenChange={(open) => open ? onShowForm() : onCancel()}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingCostingRule ? 'Edit Costing Rule' : 'Add Costing Rule'}
                  </DialogTitle>
                  <DialogDescription>
                    Define cost calculation rules for technology components
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="component">Component Name *</Label>
                    <Input
                      id="component"
                      value={formData.component}
                      onChange={(e) => setFormData({...formData, component: e.target.value})}
                      placeholder="e.g., Drip Pipes, Emitters, Filters"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="costPerUnit">Cost per Unit *</Label>
                      <Input
                        id="costPerUnit"
                        type="number"
                        step="0.01"
                        value={formData.costPerUnit}
                        onChange={(e) => setFormData({...formData, costPerUnit: e.target.value})}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit *</Label>
                      <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="m">Meter</SelectItem>
                          <SelectItem value="m2">Square Meter</SelectItem>
                          <SelectItem value="ha">Hectare</SelectItem>
                          <SelectItem value="pcs">Pieces</SelectItem>
                          <SelectItem value="kg">Kilogram</SelectItem>
                          <SelectItem value="hr">Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="formula">Calculation Formula *</Label>
                    <Textarea
                      id="formula"
                      value={formData.formula}
                      onChange={(e) => setFormData({...formData, formula: e.target.value})}
                      placeholder="e.g., area * spacing * cost_per_unit"
                      rows={2}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="factors">Factors (comma-separated)</Label>
                    <Input
                      id="factors"
                      value={formData.factors}
                      onChange={(e) => setFormData({...formData, factors: e.target.value})}
                      placeholder="e.g., area, spacing, efficiency"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCostingRule ? 'Update' : 'Add'} Rule
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>
            Define cost calculation rules for technology components
          </CardDescription>
        </CardHeader>
        <CardContent>
          {costingRules.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <Calculator className="w-12 h-12 mx-auto mb-4 text-stone-300" />
              <p className="text-lg font-medium">No costing rules available</p>
              <p className="text-sm">Click "Add Rule" to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Cost per Unit</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Formula</TableHead>
                  <TableHead>Factors</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costingRules.map((rule) => (
                  <TableRow key={rule.component}>
                    <TableCell className="font-medium">{rule.component}</TableCell>
                    <TableCell>TSh {rule.costPerUnit.toLocaleString()}</TableCell>
                    <TableCell>{rule.unit}</TableCell>
                    <TableCell className="max-w-xs truncate">{rule.formula}</TableCell>
                    <TableCell>{rule.factors.join(', ')}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(rule)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(rule.component)}
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

export default CostingRulesTabContent;
