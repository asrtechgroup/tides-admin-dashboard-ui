
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Wrench, Users } from 'lucide-react';
import { ResourceItem } from '@/types/project-wizard';
import ResourceCategoryForm from './resources/ResourceCategoryForm';
import ResourcesTable from './resources/ResourcesTable';
import ResourceSummaryCard from './resources/ResourceSummaryCard';
import ProjectTotalCard from './resources/ProjectTotalCard';
import { mockMaterials, mockEquipment, mockLabor } from './resources/mockResourcesData';

interface ResourcesSelectionStepProps {
  data: ResourceItem[];
  onUpdate: (data: ResourceItem[]) => void;
}

const ResourcesSelectionStep: React.FC<ResourcesSelectionStepProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'equipment' | 'labor'>('materials');

  const getItemsByCategory = (category: 'materials' | 'equipment' | 'labor') => {
    switch (category) {
      case 'materials': return mockMaterials;
      case 'equipment': return mockEquipment;
      case 'labor': return mockLabor;
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
