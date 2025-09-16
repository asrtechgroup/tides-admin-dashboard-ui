import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Package, Users, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { materialsAPI } from '@/services/api';

interface ResourceItem {
  id: string;
  name: string;
  category: 'materials' | 'equipment' | 'labor';
  unit: string;
  unitRate: number;
  requiredQuantity: number;
  totalCost: number;
  specifications?: string;
  editable: boolean;
}

interface ResourcesData {
  materials: ResourceItem[];
  equipment: ResourceItem[];
  labor: ResourceItem[];
  totalCost: {
    materials: number;
    equipment: number;
    labor: number;
    grand: number;
  };
}

interface ResourcesStepProps {
  data: ResourcesData | null;
  projectId?: string;
  onUpdate: (data: ResourcesData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ResourcesStep: React.FC<ResourcesStepProps> = ({
  data,
  projectId,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [resources, setResources] = useState<ResourcesData>(data || {
    materials: [],
    equipment: [],
    labor: [],
    totalCost: { materials: 0, equipment: 0, labor: 0, grand: 0 }
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadResources();
  }, [projectId]);

  const loadResources = async () => {
    if (!projectId) return;

    try {
      setLoadingData(true);
      
      // TODO: Implement API call to GET /api/projects/:id/resources/
      // const response = await projectAPI.getProjectResources(projectId);
      
      // For now, load from materials API and create resource requirements
      const [materialsData, equipmentData, laborData] = await Promise.all([
        materialsAPI.getMaterials(),
        materialsAPI.getEquipment(),
        materialsAPI.getLaborRates()
      ]);

      // Convert API data to resource items with estimated quantities
      const materials: ResourceItem[] = (Array.isArray(materialsData) ? materialsData : (materialsData as any)?.results || [])
        .slice(0, 5) // Limit to first 5 items for demo
        .map((item: any) => ({
          id: item.id,
          name: item.name,
          category: 'materials' as const,
          unit: item.unit,
          unitRate: item.current_price || item.regional_price || 0,
          requiredQuantity: Math.floor(Math.random() * 100) + 10, // Random quantity for demo
          totalCost: 0,
          specifications: item.specifications,
          editable: true
        }));

      const equipment: ResourceItem[] = (Array.isArray(equipmentData) ? equipmentData : (equipmentData as any)?.results || [])
        .slice(0, 3) // Limit to first 3 items for demo
        .map((item: any) => ({
          id: item.id,
          name: item.name,
          category: 'equipment' as const,
          unit: item.unit || 'hours',
          unitRate: item.rental_rate || item.current_price || 0,
          requiredQuantity: Math.floor(Math.random() * 50) + 5, // Random quantity for demo
          totalCost: 0,
          specifications: item.specifications,
          editable: true
        }));

      const labor: ResourceItem[] = (Array.isArray(laborData) ? laborData : (laborData as any)?.results || [])
        .slice(0, 4) // Limit to first 4 items for demo
        .map((item: any) => ({
          id: item.id,
          name: item.name || item.skill_level,
          category: 'labor' as const,
          unit: item.unit || 'hours',
          unitRate: item.hourly_rate || item.current_price || 0,
          requiredQuantity: Math.floor(Math.random() * 200) + 50, // Random quantity for demo
          totalCost: 0,
          specifications: `${item.skill_level} - ${item.trade_specialization}`,
          editable: true
        }));

      // Calculate total costs
      const calculateCosts = (items: ResourceItem[]) => {
        return items.map(item => ({
          ...item,
          totalCost: item.unitRate * item.requiredQuantity
        }));
      };

      const materialsWithCosts = calculateCosts(materials);
      const equipmentWithCosts = calculateCosts(equipment);
      const laborWithCosts = calculateCosts(labor);

      const totalCost = {
        materials: materialsWithCosts.reduce((sum, item) => sum + item.totalCost, 0),
        equipment: equipmentWithCosts.reduce((sum, item) => sum + item.totalCost, 0),
        labor: laborWithCosts.reduce((sum, item) => sum + item.totalCost, 0),
        grand: 0
      };
      totalCost.grand = totalCost.materials + totalCost.equipment + totalCost.labor;

      const resourcesData: ResourcesData = {
        materials: materialsWithCosts,
        equipment: equipmentWithCosts,
        labor: laborWithCosts,
        totalCost
      };

      setResources(resourcesData);
      
    } catch (error) {
      console.error('Error loading resources:', error);
      toast.error('Failed to load project resources');
    } finally {
      setLoadingData(false);
    }
  };

  const handleEdit = (item: ResourceItem) => {
    setEditingId(item.id);
    setEditQuantity(item.requiredQuantity);
  };

  const handleSave = (category: 'materials' | 'equipment' | 'labor', id: string) => {
    const updatedResources = { ...resources };
    const categoryItems = updatedResources[category];
    const itemIndex = categoryItems.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
      categoryItems[itemIndex].requiredQuantity = editQuantity;
      categoryItems[itemIndex].totalCost = categoryItems[itemIndex].unitRate * editQuantity;
      
      // Recalculate totals
      const materialsCost = updatedResources.materials.reduce((sum, item) => sum + item.totalCost, 0);
      const equipmentCost = updatedResources.equipment.reduce((sum, item) => sum + item.totalCost, 0);
      const laborCost = updatedResources.labor.reduce((sum, item) => sum + item.totalCost, 0);
      
      updatedResources.totalCost = {
        materials: materialsCost,
        equipment: equipmentCost,
        labor: laborCost,
        grand: materialsCost + equipmentCost + laborCost
      };
      
      setResources(updatedResources);
      setEditingId(null);
      toast.success('Quantity updated successfully');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditQuantity(0);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // TODO: Implement API call to save resources
      // await projectAPI.saveProjectResources(projectId, resources);
      
      onUpdate(resources);
      toast.success('Resources saved successfully');
      onNext();
      
    } catch (error) {
      console.error('Error saving resources:', error);
      toast.error('Failed to save resources');
    } finally {
      setLoading(false);
    }
  };

  const renderResourceTable = (items: ResourceItem[], category: 'materials' | 'equipment' | 'labor') => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No {category} requirements loaded
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Specifications</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Rate (TSh)</TableHead>
            <TableHead>Required Qty</TableHead>
            <TableHead>Total Cost (TSh)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.specifications || '-'}
              </TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{item.unitRate.toLocaleString()}</TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(parseFloat(e.target.value) || 0)}
                    className="w-20"
                  />
                ) : (
                  item.requiredQuantity.toLocaleString()
                )}
              </TableCell>
              <TableCell className="font-semibold">
                {item.totalCost.toLocaleString()}
              </TableCell>
              <TableCell>
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSave(category, item.id)}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    disabled={!item.editable}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (loadingData) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading project resources...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Resources Requirements
        </CardTitle>
        <CardDescription>
          Review and adjust material, equipment, and labor requirements for your project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cost Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Materials</p>
                  <p className="font-semibold">TSh {resources.totalCost.materials.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Equipment</p>
                  <p className="font-semibold">TSh {resources.totalCost.equipment.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Labor</p>
                  <p className="font-semibold">TSh {resources.totalCost.labor.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge className="text-xs">Total</Badge>
                <div>
                  <p className="text-sm text-muted-foreground">Grand Total</p>
                  <p className="font-bold text-lg">TSh {resources.totalCost.grand.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources Tables */}
        <Tabs defaultValue="materials" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Materials ({resources.materials.length})
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Equipment ({resources.equipment.length})
            </TabsTrigger>
            <TabsTrigger value="labor" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Labor ({resources.labor.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="materials" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Materials Requirements</CardTitle>
                <CardDescription>
                  Materials needed for construction and installation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderResourceTable(resources.materials, 'materials')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Equipment Requirements</CardTitle>
                <CardDescription>
                  Equipment and machinery needed for the project
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderResourceTable(resources.equipment, 'equipment')}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Labor Requirements</CardTitle>
                <CardDescription>
                  Skilled and unskilled labor required for the project
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderResourceTable(resources.labor, 'labor')}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Hydraulic Design
          </Button>
          
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Next: BOQ & Costing'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesStep;