import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, DollarSign, Users, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { materialsAPI } from '@/services/api';

interface UnitPrice {
  id: string;
  name: string;
  description: string;
  unit: string;
  rate: number;
  category: string;
}

interface UnitPricesStepProps {
  laborPrices: UnitPrice[];
  materialPrices: UnitPrice[];
  equipmentPrices: UnitPrice[];
  onPricesChange: (labor: UnitPrice[], materials: UnitPrice[], equipment: UnitPrice[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const UnitPricesStep: React.FC<UnitPricesStepProps> = ({
  laborPrices,
  materialPrices,
  equipmentPrices,
  onPricesChange,
  onNext,
  onPrevious
}) => {
  const [activeTab, setActiveTab] = useState('labor');
  const [editingItem, setEditingItem] = useState<UnitPrice | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    unit: '',
    rate: 0,
    category: ''
  });
  const [loading, setLoading] = useState(false);

  // Load existing data from backend
  useEffect(() => {
    loadExistingPrices();
  }, []);

  const loadExistingPrices = async () => {
    try {
      setLoading(true);
        const [laborData, materialsData, equipmentData] = await Promise.all([
          materialsAPI.getLaborRates(), // Use getLaborRates instead of getLabor
          materialsAPI.getMaterials(),
          materialsAPI.getEquipment()
        ]);

      // Convert backend data to our format
      const labor = (laborData?.results || laborData || []).map((item: any) => ({
        id: item.id,
        name: item.name || item.skill_level,
        description: item.description || `${item.skill_level} - ${item.trade_specialization}`,
        unit: item.unit || 'hour',
        rate: item.hourly_rate || item.current_price || 0,
        category: 'labor'
      }));

      const materials = (materialsData?.results || materialsData || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.specifications || item.description || '',
        unit: item.unit,
        rate: item.current_price || item.regional_price || 0,
        category: item.category?.name || 'materials'
      }));

      const equipment = (equipmentData?.results || equipmentData || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.specifications || item.description || '',
        unit: item.unit || 'hour',
        rate: item.rental_rate || item.current_price || 0,
        category: 'equipment'
      }));

      onPricesChange(labor, materials, equipment);
    } catch (error) {
      console.error('Error loading prices:', error);
      toast.error('Failed to load existing price data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    if (!formData.name.trim() || !formData.unit.trim() || formData.rate <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newItem: UnitPrice = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      unit: formData.unit,
      rate: formData.rate,
      category: activeTab
    };

    let updatedLaborPrices = [...laborPrices];
    let updatedMaterialPrices = [...materialPrices];
    let updatedEquipmentPrices = [...equipmentPrices];

    if (activeTab === 'labor') {
      if (editingItem) {
        updatedLaborPrices = laborPrices.map(item => item.id === editingItem.id ? newItem : item);
      } else {
        updatedLaborPrices = [...laborPrices, newItem];
      }
    } else if (activeTab === 'materials') {
      if (editingItem) {
        updatedMaterialPrices = materialPrices.map(item => item.id === editingItem.id ? newItem : item);
      } else {
        updatedMaterialPrices = [...materialPrices, newItem];
      }
    } else if (activeTab === 'equipment') {
      if (editingItem) {
        updatedEquipmentPrices = equipmentPrices.map(item => item.id === editingItem.id ? newItem : item);
      } else {
        updatedEquipmentPrices = [...equipmentPrices, newItem];
      }
    }

    onPricesChange(updatedLaborPrices, updatedMaterialPrices, updatedEquipmentPrices);
    
    // Reset form
    setFormData({ name: '', description: '', unit: '', rate: 0, category: '' });
    setEditingItem(null);
    
    toast.success(editingItem ? 'Item updated successfully' : 'Item added successfully');
  };

  const handleEditItem = (item: UnitPrice) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      unit: item.unit,
      rate: item.rate,
      category: item.category
    });
  };

  const handleDeleteItem = (id: string) => {
    let updatedLaborPrices = [...laborPrices];
    let updatedMaterialPrices = [...materialPrices];
    let updatedEquipmentPrices = [...equipmentPrices];

    if (activeTab === 'labor') {
      updatedLaborPrices = laborPrices.filter(item => item.id !== id);
    } else if (activeTab === 'materials') {
      updatedMaterialPrices = materialPrices.filter(item => item.id !== id);
    } else if (activeTab === 'equipment') {
      updatedEquipmentPrices = equipmentPrices.filter(item => item.id !== id);
    }

    onPricesChange(updatedLaborPrices, updatedMaterialPrices, updatedEquipmentPrices);
    toast.success('Item deleted successfully');
  };

  const getCurrentPrices = () => {
    switch (activeTab) {
      case 'labor': return laborPrices;
      case 'materials': return materialPrices;
      case 'equipment': return equipmentPrices;
      default: return [];
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'labor': return <Users className="w-4 h-4" />;
      case 'materials': return <DollarSign className="w-4 h-4" />;
      case 'equipment': return <Wrench className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleNext = () => {
    const totalItems = laborPrices.length + materialPrices.length + equipmentPrices.length;
    if (totalItems === 0) {
      toast.error('Please add at least one unit price');
      return;
    }
    toast.success('Unit prices saved successfully');
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Unit Prices Setup
        </CardTitle>
        <CardDescription>
          Configure unit prices for labor, materials, and equipment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="labor" className="flex items-center gap-2">
              {getTabIcon('labor')} Labor
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              {getTabIcon('materials')} Materials
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              {getTabIcon('equipment')} Equipment
            </TabsTrigger>
          </TabsList>

          {['labor', 'materials', 'equipment'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {/* Add/Edit Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingItem ? 'Edit' : 'Add'} {tab.charAt(0).toUpperCase() + tab.slice(1)} Item
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={`Enter ${tab} name`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit *</Label>
                      <Input
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="e.g., hour, kg, piece"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rate (TSh) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.rate || ''}
                        onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                        placeholder="Enter rate"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Button onClick={handleAddItem} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        {editingItem ? 'Update' : 'Add'}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter description (optional)"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Items ({getCurrentPrices().length})
                  </h3>
                </div>
                
                {getCurrentPrices().length > 0 ? (
                  <div className="grid gap-2">
                    {getCurrentPrices().map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{item.name}</h4>
                              <Badge variant="secondary">{item.category}</Badge>
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            )}
                            <p className="font-semibold text-primary">
                              TSh {item.rate.toLocaleString()} per {item.unit}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No {tab} items added yet. Add items using the form above.
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Project Data
          </Button>
          <Button onClick={handleNext}>
            Next: Work Quantities
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitPricesStep;