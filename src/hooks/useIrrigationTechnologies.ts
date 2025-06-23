
import { useState } from 'react';
import { IrrigationTechnology } from '@/types/irrigation';
import { toast } from 'sonner';

const initialTechnologies: IrrigationTechnology[] = [
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
];

export const useIrrigationTechnologies = () => {
  const [technologies, setTechnologies] = useState<IrrigationTechnology[]>(initialTechnologies);
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

  return {
    technologies,
    showTechnologyForm,
    editingTechnology,
    setShowTechnologyForm,
    handleAddTechnology,
    handleEditTechnology,
    handleUpdateTechnology,
    handleDeleteTechnology,
    handleCancelForm,
  };
};
