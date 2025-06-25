
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { ResourceItem } from '@/types/project-wizard';

interface ResourcesSelectionStepProps {
  data: ResourceItem[];
  onUpdate: (data: ResourceItem[]) => void;
}

// Mock data based on Resources page structure
const mockMaterials = [
  { id: '1', name: 'PVC Pipe 110mm', unit: 'meter', rate: 15000 },
  { id: '2', name: 'Drip Emitter 2L/h', unit: 'piece', rate: 500 },
  { id: '3', name: 'Control Valve', unit: 'piece', rate: 1200 },
];

const mockEquipment = [
  { id: '1', name: 'Mini Excavator', unit: 'day', rate: 350000 },
  { id: '2', name: 'Trencher', unit: 'day', rate: 200000 },
];

const mockLabor = [
  { id: '1', name: 'Irrigation Technician', unit: 'day', rate: 25000 },
  { id: '2', name: 'General Laborer', unit: 'day', rate: 15000 },
];

const ResourcesSelectionStep: React.FC<ResourcesSelectionStepProps> = ({ data, onUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState<'materials' | 'labor' | 'equipment' | ''>('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  const getItemsByCategory = () => {
    switch (selectedCategory) {
      case 'materials': return mockMaterials;
      case 'equipment': return mockEquipment;
      case 'labor': return mockLabor;
      default: return [];
    }
  };

  const getSelectedItemData = () => {
    const items = getItemsByCategory();
    return items.find(item => item.id === selectedItem);
  };

  const addResource = () => {
    const itemData = getSelectedItemData();
    if (!itemData || !quantity || !description) return;

    const newResource: ResourceItem = {
      id: Date.now().toString(),
      category: selectedCategory,
      itemId: selectedItem,
      name: itemData.name,
      description,
      quantity: parseFloat(quantity),
      unit: itemData.unit,
      rate: itemData.rate,
      amount: parseFloat(quantity) * itemData.rate
    };

    onUpdate([...data, newResource]);
    
    // Reset form
    setSelectedCategory('');
    setSelectedItem('');
    setQuantity('');
    setDescription('');
  };

  const removeResource = (id: string) => {
    onUpdate(data.filter(item => item.id !== id));
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resources & Materials Selection</CardTitle>
          <CardDescription>Select materials, equipment, and labor required for your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-stone-50">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={(value: any) => {
                setSelectedCategory(value);
                setSelectedItem('');
              }}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="labor">Labor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="item">Item</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem} disabled={!selectedCategory}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {getItemsByCategory().map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="mt-2"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the specific use or requirements for this item..."
                rows={2}
                className="mt-2"
              />
            </div>

            {selectedItem && (
              <div className="md:col-span-2 lg:col-span-3 grid grid-cols-3 gap-4 p-3 bg-white rounded border">
                <div>
                  <span className="text-sm text-stone-600">Unit:</span>
                  <div className="font-medium">{getSelectedItemData()?.unit}</div>
                </div>
                <div>
                  <span className="text-sm text-stone-600">Rate:</span>
                  <div className="font-medium">TSh {getSelectedItemData()?.rate?.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm text-stone-600">Amount:</span>
                  <div className="font-medium text-emerald-600">
                    TSh {quantity ? (parseFloat(quantity) * (getSelectedItemData()?.rate || 0)).toLocaleString() : '0'}
                  </div>
                </div>
              </div>
            )}

            <div className="md:col-span-2 lg:col-span-3 flex justify-end">
              <Button 
                onClick={addResource} 
                disabled={!selectedCategory || !selectedItem || !quantity || !description}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </div>
          </div>

          {data.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Selected Resources</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Rate (TSh)</TableHead>
                    <TableHead>Amount (TSh)</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="capitalize">{item.category}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.rate.toLocaleString()}</TableCell>
                      <TableCell>{item.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeResource(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Card className="bg-stone-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Estimated Cost:</span>
                    <span className="text-xl font-bold text-emerald-600">
                      TSh {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {data.length === 0 && (
            <div className="text-center py-8 text-stone-500">
              <p>No resources selected yet. Add resources above to build your project requirements.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesSelectionStep;
