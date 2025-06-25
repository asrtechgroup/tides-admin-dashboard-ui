
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Package, Wrench, Users } from 'lucide-react';
import { ResourceItem } from '@/types/project-wizard';

interface ResourcesSelectionStepProps {
  data: ResourceItem[];
  onUpdate: (data: ResourceItem[]) => void;
}

// Mock data based on Resources page structure with specifications
const mockMaterials = [
  { id: '1', name: 'PVC Pipe 110mm', unit: 'meter', rate: 15000, specifications: '110mm diameter, PN10, SDR17' },
  { id: '2', name: 'PVC Pipe 110mm PN16', unit: 'meter', rate: 18000, specifications: '110mm diameter, PN16, SDR11' },
  { id: '3', name: 'HDPE Pipe 110mm', unit: 'meter', rate: 22000, specifications: '110mm diameter, PN10, PE100' },
  { id: '4', name: 'PVC Pipe 200mm', unit: 'meter', rate: 35000, specifications: '200mm diameter, PN10, SDR17' },
  { id: '5', name: 'PVC Pipe 90mm', unit: 'meter', rate: 12000, specifications: '90mm diameter, PN10, SDR17' },
  { id: '6', name: 'Drip Emitter 2L/h', unit: 'piece', rate: 500, specifications: '2L/h flow rate, self-compensating' },
  { id: '7', name: 'Control Valve', unit: 'piece', rate: 1200, specifications: 'Manual control valve, 2-inch' },
];

const mockEquipment = [
  { id: '1', name: 'Mini Excavator', unit: 'day', rate: 350000, specifications: '1.5-ton capacity, hydraulic' },
  { id: '2', name: 'Trencher', unit: 'day', rate: 200000, specifications: 'Chain trencher, 600mm depth' },
  { id: '3', name: 'Water Pump', unit: 'day', rate: 50000, specifications: 'Centrifugal pump, 50HP' },
];

const mockLabor = [
  { id: '1', name: 'Irrigation Technician', unit: 'day', rate: 25000, specifications: 'Certified irrigation specialist' },
  { id: '2', name: 'General Laborer', unit: 'day', rate: 15000, specifications: 'Construction and installation work' },
  { id: '3', name: 'Pipe Welder', unit: 'day', rate: 30000, specifications: 'Certified pipe welding specialist' },
];

const ResourcesSelectionStep: React.FC<ResourcesSelectionStepProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'equipment' | 'labor'>('materials');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  const getItemsByCategory = (category: 'materials' | 'equipment' | 'labor') => {
    switch (category) {
      case 'materials': return mockMaterials;
      case 'equipment': return mockEquipment;
      case 'labor': return mockLabor;
      default: return [];
    }
  };

  const getSelectedItemData = () => {
    const items = getItemsByCategory(activeTab);
    return items.find(item => item.id === selectedItem);
  };

  const addResource = () => {
    const itemData = getSelectedItemData();
    if (!itemData || !quantity || !description) return;

    const newResource: ResourceItem = {
      id: Date.now().toString(),
      category: activeTab,
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
    setSelectedItem('');
    setQuantity('');
    setDescription('');
  };

  const removeResource = (id: string) => {
    onUpdate(data.filter(item => item.id !== id));
  };

  const getResourcesByCategory = (category: 'materials' | 'equipment' | 'labor') => {
    return data.filter(item => item.category === category);
  };

  const getTotalByCategory = (category: 'materials' | 'equipment' | 'labor') => {
    return getResourcesByCategory(category).reduce((sum, item) => sum + item.amount, 0);
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const renderResourceForm = (category: 'materials' | 'equipment' | 'labor') => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-stone-50">
        <div>
          <Label htmlFor="item">Select {category.slice(0, -1)}</Label>
          <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={`Select ${category.slice(0, -1)}`} />
            </SelectTrigger>
            <SelectContent>
              {getItemsByCategory(category).map((item) => (
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

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Describe the specific use or requirements for this ${category.slice(0, -1)}...`}
            rows={2}
            className="mt-2"
          />
        </div>

        {selectedItem && (
          <div className="md:col-span-2 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-white rounded border">
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
            
            <div className="p-3 bg-blue-50 rounded border">
              <span className="text-sm text-stone-600">Specifications:</span>
              <div className="font-medium text-blue-800">{getSelectedItemData()?.specifications}</div>
            </div>
          </div>
        )}

        <div className="md:col-span-2 flex justify-end">
          <Button 
            onClick={addResource} 
            disabled={!selectedItem || !quantity || !description}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {category.slice(0, -1)}
          </Button>
        </div>
      </div>

      {getResourcesByCategory(category).length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium">Selected {category}</h4>
          <Table>
            <TableHeader>
              <TableRow>
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
              {getResourcesByCategory(category).map((item) => (
                <TableRow key={item.id}>
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
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{category} Subtotal:</span>
                <span className="text-lg font-bold text-emerald-600">
                  TSh {getTotalByCategory(category).toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {getResourcesByCategory(category).length === 0 && (
        <div className="text-center py-8 text-stone-500">
          <p>No {category} selected yet. Add {category} above to build your project requirements.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resources & Materials Selection</CardTitle>
          <CardDescription>Select materials, equipment, and labor required for your project</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'materials' | 'equipment' | 'labor')} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="materials" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Materials
              </TabsTrigger>
              <TabsTrigger value="equipment" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Equipment
              </TabsTrigger>
              <TabsTrigger value="labor" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Labor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="materials">
              {renderResourceForm('materials')}
            </TabsContent>

            <TabsContent value="equipment">
              {renderResourceForm('equipment')}
            </TabsContent>

            <TabsContent value="labor">
              {renderResourceForm('labor')}
            </TabsContent>
          </Tabs>

          {data.length > 0 && (
            <Card className="bg-emerald-50 mt-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Total Project Cost:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    TSh {totalAmount.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesSelectionStep;
