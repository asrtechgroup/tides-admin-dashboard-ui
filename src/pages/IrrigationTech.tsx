
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, Settings, Target } from 'lucide-react';
import { useIrrigationTechnologies } from '@/hooks/useIrrigationTechnologies';
import TechnologiesTabContent from '@/components/irrigation/TechnologiesTabContent';
import EmptyTabContent from '@/components/irrigation/EmptyTabContent';

const IrrigationTech = () => {
  const {
    technologies,
    showTechnologyForm,
    editingTechnology,
    setShowTechnologyForm,
    handleAddTechnology,
    handleEditTechnology,
    handleUpdateTechnology,
    handleDeleteTechnology,
    handleCancelForm,
  } = useIrrigationTechnologies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Irrigation Technologies</h1>
        <p className="text-stone-600 mt-1">Manage supported irrigation technologies and their specifications</p>
      </div>

      <Tabs defaultValue="technologies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="technologies" className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Technologies
          </TabsTrigger>
          <TabsTrigger value="specifications" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Specifications
          </TabsTrigger>
          <TabsTrigger value="suitability" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Suitability
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technologies" className="space-y-4">
          <TechnologiesTabContent
            technologies={technologies}
            showTechnologyForm={showTechnologyForm}
            editingTechnology={editingTechnology}
            onShowForm={() => setShowTechnologyForm(true)}
            onEdit={handleEditTechnology}
            onDelete={handleDeleteTechnology}
            onSubmit={editingTechnology ? handleUpdateTechnology : handleAddTechnology}
            onCancel={handleCancelForm}
          />
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          <EmptyTabContent
            title="Technical Specifications"
            description="Detailed technical parameters for each technology"
            buttonText="Add Specification"
            Icon={Settings}
            emptyMessage='No specifications available. Click "Add Specification" to get started.'
          />
        </TabsContent>

        <TabsContent value="suitability" className="space-y-4">
          <EmptyTabContent
            title="Suitability Criteria"
            description="Define criteria for technology selection and recommendations"
            buttonText="Add Criteria"
            Icon={Target}
            emptyMessage='No suitability criteria available. Click "Add Criteria" to get started.'
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IrrigationTech;
