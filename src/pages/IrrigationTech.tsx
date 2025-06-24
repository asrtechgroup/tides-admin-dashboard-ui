
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, Settings, Target } from 'lucide-react';
import { useIrrigationTechnologies } from '@/hooks/useIrrigationTechnologies';
import TechnologiesTabContent from '@/components/irrigation/TechnologiesTabContent';
import SpecificationsTabContent from '@/components/irrigation/SpecificationsTabContent';
import EmptyTabContent from '@/components/irrigation/EmptyTabContent';
import { TechSpecification } from '@/types/irrigation';
import { toast } from 'sonner';

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

  // Specifications state
  const [specifications, setSpecifications] = useState<TechSpecification[]>([
    {
      parameter: 'Flow Rate',
      value: '2.0',
      unit: 'L/h',
      description: 'Water flow rate per emitter',
    },
    {
      parameter: 'Operating Pressure',
      value: '1.0-2.5',
      unit: 'bar',
      description: 'Recommended operating pressure range',
    },
  ]);

  const [showSpecificationForm, setShowSpecificationForm] = useState(false);
  const [editingSpecification, setEditingSpecification] = useState<TechSpecification | undefined>();

  // Specification handlers
  const handleAddSpecification = (data: any) => {
    const newSpecification: TechSpecification = {
      ...data,
    };
    setSpecifications([...specifications, newSpecification]);
    setShowSpecificationForm(false);
    toast.success('Specification added successfully');
  };

  const handleEditSpecification = (specification: TechSpecification) => {
    setEditingSpecification(specification);
    setShowSpecificationForm(true);
  };

  const handleUpdateSpecification = (data: any) => {
    if (editingSpecification) {
      const index = specifications.findIndex(s => 
        s.parameter === editingSpecification.parameter && 
        s.value === editingSpecification.value
      );
      if (index !== -1) {
        const updatedSpecs = [...specifications];
        updatedSpecs[index] = { ...data };
        setSpecifications(updatedSpecs);
        setShowSpecificationForm(false);
        setEditingSpecification(undefined);
        toast.success('Specification updated successfully');
      }
    }
  };

  const handleDeleteSpecification = (id: string) => {
    const index = parseInt(id);
    setSpecifications(specifications.filter((_, i) => i !== index));
    toast.success('Specification deleted successfully');
  };

  const handleCancelSpecificationForm = () => {
    setShowSpecificationForm(false);
    setEditingSpecification(undefined);
  };

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
          <SpecificationsTabContent
            specifications={specifications}
            showSpecificationForm={showSpecificationForm}
            editingSpecification={editingSpecification}
            onShowForm={() => setShowSpecificationForm(true)}
            onEdit={handleEditSpecification}
            onDelete={handleDeleteSpecification}
            onSubmit={editingSpecification ? handleUpdateSpecification : handleAddSpecification}
            onCancel={handleCancelSpecificationForm}
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
