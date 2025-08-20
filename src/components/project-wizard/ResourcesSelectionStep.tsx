
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Wrench, Users } from 'lucide-react';
import { ResourceItem } from '@/types/project-wizard';
import ResourceCategoryForm from './resources/ResourceCategoryForm';
import ResourcesTable from './resources/ResourcesTable';
import ResourceSummaryCard from './resources/ResourceSummaryCard';
import ProjectTotalCard from './resources/ProjectTotalCard';
import { resourcesAPI } from '@/services/api';

interface ResourcesSelectionStepProps {
  data: ResourceItem[];
  onUpdate: (data: ResourceItem[]) => void;
}

const ResourcesSelectionStep: React.FC<ResourcesSelectionStepProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'equipment' | 'labor'>('materials');
  const [materials, setMaterials] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [laborRates, setLaborRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load resources data from Django API
  React.useEffect(() => {
    loadResourcesData();
  }, []);

  const loadResourcesData = async () => {
    try {
      setLoading(true);
      const [materialsData, equipmentData, laborData] = await Promise.all([
        resourcesAPI.getMaterials(),
        resourcesAPI.getEquipment(),
        resourcesAPI.getLaborRates(),
      ]);

      setMaterials(Array.isArray(materialsData) ? materialsData : (materialsData as any)?.results || []);
      setEquipment(Array.isArray(equipmentData) ? equipmentData : (equipmentData as any)?.results || []);
      setLaborRates(Array.isArray(laborData) ? laborData : (laborData as any)?.results || []);
    } catch (error) {
      console.error('Failed to load resources data:', error);
      // Use fallback mock data if API fails
      setMaterials([
        { id: '1', name: 'PVC Pipe 110mm', unit: 'meter', rate: 15000, specifications: '110mm diameter, PN10, SDR17' },
        { id: '2', name: 'HDPE Pipe 110mm', unit: 'meter', rate: 22000, specifications: '110mm diameter, PN10, PE100' },
        { id: '3', name: 'Drip Emitter 2L/h', unit: 'piece', rate: 500, specifications: '2L/h flow rate, self-compensating' },
      ]);
      setEquipment([
        { id: '1', name: 'Mini Excavator', unit: 'day', rate: 350000, specifications: '1.5-ton capacity, hydraulic' },
        { id: '2', name: 'Water Pump', unit: 'day', rate: 50000, specifications: 'Centrifugal pump, 50HP' },
      ]);
      setLaborRates([
        { id: '1', name: 'Irrigation Technician', unit: 'day', rate: 25000, specifications: 'Certified irrigation specialist' },
        { id: '2', name: 'General Laborer', unit: 'day', rate: 15000, specifications: 'Construction and installation work' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getItemsByCategory = (category: 'materials' | 'equipment' | 'labor') => {
    switch (category) {
      case 'materials': return materials;
      case 'equipment': return equipment;
      case 'labor': return laborRates;
      default: return [];
    }
  };

  const addResource = (newResource: ResourceItem) => {
    onUpdate([...data, newResource]);
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

  const renderResourceTab = (category: 'materials' | 'equipment' | 'labor') => {
    const categoryResources = getResourcesByCategory(category);
    const categoryTotal = getTotalByCategory(category);

    return (
      <div className="space-y-4">
        <ResourceCategoryForm
          category={category}
          items={getItemsByCategory(category)}
          onAddResource={addResource}
        />

        <ResourcesTable
          resources={categoryResources}
          onRemove={removeResource}
        />

        {categoryResources.length > 0 && (
          <ResourceSummaryCard
            category={category}
            total={categoryTotal}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading resources data...</p>
        </div>
      </div>
    );
  }

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
              {renderResourceTab('materials')}
            </TabsContent>

            <TabsContent value="equipment">
              {renderResourceTab('equipment')}
            </TabsContent>

            <TabsContent value="labor">
              {renderResourceTab('labor')}
            </TabsContent>
          </Tabs>

          {data.length > 0 && (
            <ProjectTotalCard total={totalAmount} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourcesSelectionStep;
