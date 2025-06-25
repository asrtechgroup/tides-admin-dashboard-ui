
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { ResourceItem } from '@/types/project-wizard';

interface ResourceCategoryFormProps {
  category: 'materials' | 'equipment' | 'labor';
  items: Array<{ id: string; name: string; unit: string; rate: number; specifications: string }>;
  onAddResource: (resource: ResourceItem) => void;
}

const ResourceCategoryForm: React.FC<ResourceCategoryFormProps> = ({ 
  category, 
  items, 
  onAddResource 
}) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  const getSelectedItemData = () => {
    return items.find(item => item.id === selectedItem);
  };

  const handleAddResource = () => {
    const itemData = getSelectedItemData();
    if (!itemData || !quantity || !description) return;

    const newResource: ResourceItem = {
      id: Date.now().toString(),
      category,
      itemId: selectedItem,
      name: itemData.name,
      description,
      quantity: parseFloat(quantity),
      unit: itemData.unit,
      rate: itemData.rate,
      amount: parseFloat(quantity) * itemData.rate
    };

    onAddResource(newResource);
    
    // Reset form
    setSelectedItem('');
    setQuantity('');
    setDescription('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-stone-50">
      <div>
        <Label htmlFor="item">Select {category.slice(0, -1)}</Label>
        <Select value={selectedItem} onValueChange={setSelectedItem}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder={`Select ${category.slice(0, -1)}`} />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
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
          onClick={handleAddResource} 
          disabled={!selectedItem || !quantity || !description}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {category.slice(0, -1)}
        </Button>
      </div>
    </div>
  );
};

export default ResourceCategoryForm;
