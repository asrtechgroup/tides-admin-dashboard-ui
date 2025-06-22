
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Droplets, Settings, Target } from 'lucide-react';
import { I`IrrigationTechnology } from '@/types/irrigation';
import TechnologyForm from '@/components/irrigation/TechnologyForm';
import TechnologiesTable from '@/components/irrigation/TechnologiesTable';
import { toast } from 'sonner';

const IrrigationTech = () => {
  const [technologies, setTechnologies] = useState<IrrigationTechnology[]>([
    {
      id: '1',
      name: 'Precision Drip System',
      type: 'drip',
      description: 'High-efficiency drip irrigation with precision emitters',
      efficiency: 95,
      waterRequirement: 2.5,
      maintenanceLevel: 'medium',
      lifespan: 15,
      specifications: [],
      costingRules: [],
      suitabilityCriteria: {
        soilTypes: ['clay', 'loam', 'sandy-loam'],
        cropTypes: ['vegetables', 'fruits', 'cash-crops'],
        farmSizes: ['small', 'medium', 'large'],
        waterQuality: ['good', 'moderate'],
        topography: ['flat', 'gentle-slope'],
        climateZones: ['arid', 'semi-arid'],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Micro Sprinkler System',
      type: 'micro-spray',
      description: 'Low-pressure micro sprinkler for uniform water distribution',
      efficiency: 85,
      waterRequirement: 4.0,
      maintenanceLevel: 'low',
      lifespan: 12,
      specifications: [],
      costingRules: [],
      suitabilityCriteria: {
        soilTypes: ['sandy', 'loam', 'sandy-loam'],
        cropTypes: ['fruits', 'vegetables'],
        farmSizes: ['small', 'medium'],
        waterQuality: ['good'],
        topography: ['flat', 'gentle-slope', 'moderate-slope'],
        climateZones: ['humid', 'semi-humid'],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [showTechnologyForm, setShowTechnologyForm] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState<IrrigationTechnology | undefined>();

  const handleAddTechnology = (data: any) => {
    const newTechnology: IrrigationTechnology = {
      id: Date.now().toString(),
      ...data,
      specifications: [],
      costingRules: [],
      suitabilityCriteria: {
        soilTypes: [],
        cropTypes: [],
        farmSizes: [],
        waterQuality: [],
        topography: [],
        climateZones: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTechnologies([...technologies, newTechnology]);
    setShowTechnologyForm(false);
    toast.success('Technology added successfully');
  };

  const handleEditTechnology = (technology: IrrigationTechnology) => {
    setEditingTechnology(technology);
    setShowTechnologyForm(true);
  };

  const handleUpdateTechnology = (data: any) => {
    if (editingTechnology) {
      setTechnologies(technologies.map(t => 
        t.id === editingTechnology.id 
          ? { ...editingTechnology, ...data, updatedAt: new Date().toISOString() }
          : t
      ));
      setShowTechnologyForm(false);
      setEditingTechnology(undefined);
      toast.success('Technology updated successfully');
    }
  };

  const handleDeleteTechnology = (id: string) => {
    setTechnologies(technologies.filter(t => t.id !== id));
    toast.success('Technology deleted successfully');
  };

  const handleCancelForm = () => {
    setShowTechnologyForm(false);
    setEditingTechnology(undefined);
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
          {showTechnologyForm ? (
            <TechnologyForm
              technology={editingTechnology}
              onSubmit={editingTechnology ? handleUpdateTechnology : handleAddTechnology}
              onCancel={handleCancelForm}
            />
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Technology Catalog</h2>
                  <p className="text-stone-600">Manage irrigation technology types and specifications</p>
                </div>
                <Button onClick={() => setShowTechnologyForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Technology
                </Button>
              </div>

              <TechnologiesTable
                technologies={technologies}
                onEdit={handleEditTechnology}
                onDelete={handleDeleteTechnology}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="specifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Technical Specifications</CardTitle>
                  <p className="text-stone-600 mt-1">Detailed technical parameters for each technology</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-stone-500">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No specifications available. Click "Add Specification" to get started.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suitability" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Suitability Criteria</CardTitle>
                  <p className="text-stone-600 mt-1">Define criteria for technology selection and recommendations</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Criteria
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-stone-500">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No suitability criteria available. Click "Add Criteria" to get started.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IrrigationTech;
