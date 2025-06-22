
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, Wrench, Users } from 'lucide-react';
import { Material, Equipment, Labor } from '@/types/resources';
import MaterialForm from '@/components/resources/MaterialForm';
import MaterialsTable from '@/components/resources/MaterialsTable';
import { toast } from 'sonner';

const Resources = () => {
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      name: 'PVC Pipe 110mm',
      category: 'pipes',
      unit: 'meter',
      basePrice: 15000,
      supplier: 'Tanzania Pipes Ltd',
      specifications: '110mm diameter, PN10, SDR17',
      regionalPricing: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Drip Emitter 2L/h',
      category: 'fittings',
      unit: 'piece',
      basePrice: 500,
      supplier: 'Irrigation Solutions',
      specifications: '2L/h flow rate, self-compensating',
      regionalPricing: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();

  const handleAddMaterial = (data: any) => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      ...data,
      regionalPricing: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMaterials([...materials, newMaterial]);
    setShowMaterialForm(false);
    toast.success('Material added successfully');
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setShowMaterialForm(true);
  };

  const handleUpdateMaterial = (data: any) => {
    if (editingMaterial) {
      setMaterials(materials.map(m => 
        m.id === editingMaterial.id 
          ? { ...editingMaterial, ...data, updatedAt: new Date().toISOString() }
          : m
      ));
      setShowMaterialForm(false);
      setEditingMaterial(undefined);
      toast.success('Material updated successfully');
    }
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
    toast.success('Material deleted successfully');
  };

  const handleCancelForm = () => {
    setShowMaterialForm(false);
    setEditingMaterial(undefined);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Resources & Cost Database</h1>
        <p className="text-stone-600 mt-1">Manage materials, equipment, and cost databases</p>
      </div>

      <Tabs defaultValue="materials" className="space-y-4">
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

        <TabsContent value="materials" className="space-y-4">
          {showMaterialForm ? (
            <MaterialForm
              material={editingMaterial}
              onSubmit={editingMaterial ? handleUpdateMaterial : handleAddMaterial}
              onCancel={handleCancelForm}
            />
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Materials Inventory</h2>
                  <p className="text-stone-600">Manage irrigation materials and their pricing</p>
                </div>
                <Button onClick={() => setShowMaterialForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </div>

              <MaterialsTable
                materials={materials}
                onEdit={handleEditMaterial}
                onDelete={handleDeleteMaterial}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Equipment Rates</CardTitle>
                  <p className="text-stone-600 mt-1">Manage construction equipment and rental rates</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-stone-500">
                <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No equipment data available. Click "Add Equipment" to get started.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labor" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Labor Costs</CardTitle>
                  <p className="text-stone-600 mt-1">Manage labor rates by skill and region</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Labor Rate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-stone-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No labor data available. Click "Add Labor Rate" to get started.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
