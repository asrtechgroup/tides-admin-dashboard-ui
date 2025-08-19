import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, Wrench, Users } from 'lucide-react';
import { Material, Equipment, Labor } from '@/types/resources';
import MaterialForm from '@/components/resources/MaterialForm';
import MaterialsTable from '@/components/resources/MaterialsTable';
import EquipmentForm from '@/components/resources/EquipmentForm';
import EquipmentTable from '@/components/resources/EquipmentTable';
import LaborForm from '@/components/resources/LaborForm';
import LaborTable from '@/components/resources/LaborTable';
import { toast } from 'sonner';
import { resourcesAPI } from '@/services/api';

const Resources = () => {
  // Materials, Equipment, Labor state
  const [materials, setMaterials] = useState<Material[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [labor, setLabor] = useState<Labor[]>([]);

  // Form states
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [showLaborForm, setShowLaborForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();
  const [editingEquipment, setEditingEquipment] = useState<Equipment | undefined>();
  const [editingLabor, setEditingLabor] = useState<Labor | undefined>();

  // Fetch all resources from backend on mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [materialsData, equipmentData, laborData]: any = await Promise.all([
          resourcesAPI.getMaterials(),
          resourcesAPI.getEquipment(),
          resourcesAPI.getLaborRates(),
        ]);
        setMaterials(materialsData.results || materialsData);
        setEquipment(equipmentData.results || equipmentData);
        setLabor(laborData.results || laborData);
      } catch (error: any) {
        toast.error('Failed to load resources from backend.');
        setMaterials([]);
        setEquipment([]);
        setLabor([]);
      }
    };
    fetchResources();
  }, []);

  // Material handlers
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

  // Equipment handlers
  const handleAddEquipment = (data: any) => {
    const newEquipment: Equipment = {
      id: Date.now().toString(),
      ...data,
      availability: [],
      regionalRates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEquipment([...equipment, newEquipment]);
    setShowEquipmentForm(false);
    toast.success('Equipment added successfully');
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setShowEquipmentForm(true);
  };

  const handleUpdateEquipment = (data: any) => {
    if (editingEquipment) {
      setEquipment(equipment.map(e => 
        e.id === editingEquipment.id 
          ? { ...editingEquipment, ...data, updatedAt: new Date().toISOString() }
          : e
      ));
      setShowEquipmentForm(false);
      setEditingEquipment(undefined);
      toast.success('Equipment updated successfully');
    }
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipment(equipment.filter(e => e.id !== id));
    toast.success('Equipment deleted successfully');
  };

  // Labor handlers
  const handleAddLabor = (data: any) => {
    const newLabor: Labor = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLabor([...labor, newLabor]);
    setShowLaborForm(false);
    toast.success('Labor rate added successfully');
  };

  const handleEditLabor = (labor: Labor) => {
    setEditingLabor(labor);
    setShowLaborForm(true);
  };

  const handleUpdateLabor = (data: any) => {
    if (editingLabor) {
      setLabor(labor.map(l => 
        l.id === editingLabor.id 
          ? { ...editingLabor, ...data, updatedAt: new Date().toISOString() }
          : l
      ));
      setShowLaborForm(false);
      setEditingLabor(undefined);
      toast.success('Labor rate updated successfully');
    }
  };

  const handleDeleteLabor = (id: string) => {
    setLabor(labor.filter(l => l.id !== id));
    toast.success('Labor rate deleted successfully');
  };

  // Cancel handlers
  const handleCancelMaterialForm = () => {
    setShowMaterialForm(false);
    setEditingMaterial(undefined);
  };

  const handleCancelEquipmentForm = () => {
    setShowEquipmentForm(false);
    setEditingEquipment(undefined);
  };

  const handleCancelLaborForm = () => {
    setShowLaborForm(false);
    setEditingLabor(undefined);
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
              onCancel={handleCancelMaterialForm}
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
          {showEquipmentForm ? (
            <EquipmentForm
              equipment={editingEquipment}
              onSubmit={editingEquipment ? handleUpdateEquipment : handleAddEquipment}
              onCancel={handleCancelEquipmentForm}
            />
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Equipment Rates</h2>
                  <p className="text-stone-600">Manage construction equipment and rental rates</p>
                </div>
                <Button onClick={() => setShowEquipmentForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </div>

              <EquipmentTable
                equipment={equipment}
                onEdit={handleEditEquipment}
                onDelete={handleDeleteEquipment}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="labor" className="space-y-4">
          {showLaborForm ? (
            <LaborForm
              labor={editingLabor}
              onSubmit={editingLabor ? handleUpdateLabor : handleAddLabor}
              onCancel={handleCancelLaborForm}
            />
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Labor Costs</h2>
                  <p className="text-stone-600">Manage labor rates by skill and region</p>
                </div>
                <Button onClick={() => setShowLaborForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Labor Rate
                </Button>
              </div>

              <LaborTable
                labor={labor}
                onEdit={handleEditLabor}
                onDelete={handleDeleteLabor}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
