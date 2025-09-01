import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface UnitPrice {
  id: string;
  name: string;
  description: string;
  unit: string;
  rate: number;
  category: string;
}

interface WorkItem {
  id: string;
  description: string;
  category: 'labor' | 'materials' | 'equipment';
  unitPriceId: string;
  quantity: number;
  unitRate: number;
  totalAmount: number;
}

interface WorkQuantitiesStepProps {
  laborPrices: UnitPrice[];
  materialPrices: UnitPrice[];
  equipmentPrices: UnitPrice[];
  workItems: WorkItem[];
  onWorkItemsChange: (items: WorkItem[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const WorkQuantitiesStep: React.FC<WorkQuantitiesStepProps> = ({
  laborPrices,
  materialPrices,
  equipmentPrices,
  workItems,
  onWorkItemsChange,
  onNext,
  onPrevious
}) => {
  const [newItem, setNewItem] = useState({
    description: '',
    category: '' as 'labor' | 'materials' | 'equipment' | '',
    unitPriceId: '',
    quantity: 1
  });

  const getAllPrices = () => [
    ...laborPrices,
    ...materialPrices,
    ...equipmentPrices
  ];

  const getFilteredPrices = (category: string) => {
    switch (category) {
      case 'labor': return laborPrices;
      case 'materials': return materialPrices;
      case 'equipment': return equipmentPrices;
      default: return [];
    }
  };

  const handleAddWorkItem = () => {
    if (!newItem.description.trim() || !newItem.category || !newItem.unitPriceId || newItem.quantity <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedUnitPrice = getAllPrices().find(price => price.id === newItem.unitPriceId);
    if (!selectedUnitPrice) {
      toast.error('Invalid unit price selected');
      return;
    }

    const workItem: WorkItem = {
      id: Date.now().toString(),
      description: newItem.description,
      category: newItem.category,
      unitPriceId: newItem.unitPriceId,
      quantity: newItem.quantity,
      unitRate: selectedUnitPrice.rate,
      totalAmount: newItem.quantity * selectedUnitPrice.rate
    };

    onWorkItemsChange([...workItems, workItem]);
    
    // Reset form
    setNewItem({
      description: '',
      category: '',
      unitPriceId: '',
      quantity: 1
    });

    toast.success('Work item added successfully');
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) return;

    const updatedItems = workItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          totalAmount: quantity * item.unitRate
        };
      }
      return item;
    });

    onWorkItemsChange(updatedItems);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = workItems.filter(item => item.id !== itemId);
    onWorkItemsChange(updatedItems);
    toast.success('Work item removed');
  };

  const recalculateAll = () => {
    const updatedItems = workItems.map(item => {
      const unitPrice = getAllPrices().find(price => price.id === item.unitPriceId);
      if (unitPrice) {
        return {
          ...item,
          unitRate: unitPrice.rate,
          totalAmount: item.quantity * unitPrice.rate
        };
      }
      return item;
    });

    onWorkItemsChange(updatedItems);
    toast.success('All calculations updated');
  };

  const getTotalByCategory = (category: string) => {
    return workItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.totalAmount, 0);
  };

  const getGrandTotal = () => {
    return workItems.reduce((sum, item) => sum + item.totalAmount, 0);
  };

  const handleNext = () => {
    if (workItems.length === 0) {
      toast.error('Please add at least one work item');
      return;
    }
    toast.success('Work quantities saved successfully');
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Work Quantities & Cost Calculation
        </CardTitle>
        <CardDescription>
          Enter work quantities and let the system compute costs automatically
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Work Item Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Work Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Work Description *</Label>
                <Input
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter work description"
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value: 'labor' | 'materials' | 'equipment') => 
                    setNewItem({ ...newItem, category: value, unitPriceId: '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="labor">Labor</SelectItem>
                    <SelectItem value="materials">Materials</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Unit Price *</Label>
                <Select
                  value={newItem.unitPriceId}
                  onValueChange={(value) => setNewItem({ ...newItem, unitPriceId: value })}
                  disabled={!newItem.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit price" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilteredPrices(newItem.category).map((price) => (
                      <SelectItem key={price.id} value={price.id}>
                        {price.name} - TSh {price.rate.toLocaleString()}/{price.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newItem.quantity || ''}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 1 })}
                  placeholder="Enter quantity"
                />
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={handleAddWorkItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Items List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Work Items ({workItems.length})
            </h3>
            <Button variant="outline" onClick={recalculateAll}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Recalculate All
            </Button>
          </div>

          {workItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Description</th>
                    <th className="border border-border p-3 text-left">Category</th>
                    <th className="border border-border p-3 text-left">Unit</th>
                    <th className="border border-border p-3 text-left">Quantity</th>
                    <th className="border border-border p-3 text-left">Unit Rate (TSh)</th>
                    <th className="border border-border p-3 text-left">Total Amount (TSh)</th>
                    <th className="border border-border p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workItems.map((item) => {
                    const unitPrice = getAllPrices().find(price => price.id === item.unitPriceId);
                    return (
                      <tr key={item.id}>
                        <td className="border border-border p-3">{item.description}</td>
                        <td className="border border-border p-3">
                          <Badge variant="secondary">
                            {item.category}
                          </Badge>
                        </td>
                        <td className="border border-border p-3">{unitPrice?.unit || 'N/A'}</td>
                        <td className="border border-border p-3">
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, parseFloat(e.target.value) || 0)}
                            className="w-24"
                          />
                        </td>
                        <td className="border border-border p-3 font-medium">
                          {item.unitRate.toLocaleString()}
                        </td>
                        <td className="border border-border p-3 font-bold text-primary">
                          {item.totalAmount.toLocaleString()}
                        </td>
                        <td className="border border-border p-3">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No work items added yet. Use the form above to add work items.
              </p>
            </Card>
          )}
        </div>

        {/* Cost Summary */}
        {workItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Cost Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm text-muted-foreground">Labor Costs</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    TSh {getTotalByCategory('labor').toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm text-muted-foreground">Material Costs</h4>
                  <p className="text-2xl font-bold text-green-600">
                    TSh {getTotalByCategory('materials').toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm text-muted-foreground">Equipment Costs</h4>
                  <p className="text-2xl font-bold text-orange-600">
                    TSh {getTotalByCategory('equipment').toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                  <h4 className="font-medium text-sm text-muted-foreground">Total Project Cost</h4>
                  <p className="text-2xl font-bold text-primary">
                    TSh {getGrandTotal().toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Unit Prices
          </Button>
          <Button onClick={handleNext}>
            Next: Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkQuantitiesStep;