
import { useState } from 'react';
import { toast } from 'sonner';

interface SuitabilityCriterion {
  id: string;
  name: string;
  category: 'soil' | 'climate' | 'topography' | 'water' | 'crop';
  minValue?: number;
  maxValue?: number;
  unit?: string;
  allowedValues?: string[];
  weight: number;
  description: string;
}

const initialCriteria: SuitabilityCriterion[] = [
  {
    id: '1',
    name: 'Soil pH',
    category: 'soil',
    minValue: 6.0,
    maxValue: 7.5,
    unit: 'pH',
    weight: 8,
    description: 'Optimal pH range for most crops'
  },
  {
    id: '2',
    name: 'Annual Rainfall',
    category: 'climate',
    minValue: 500,
    maxValue: 1200,
    unit: 'mm',
    weight: 9,
    description: 'Required annual precipitation for irrigation planning'
  },
  {
    id: '3',
    name: 'Soil Type',
    category: 'soil',
    allowedValues: ['clay', 'loam', 'sandy-loam', 'sandy'],
    weight: 7,
    description: 'Suitable soil types for different irrigation methods'
  }
];

export const useSuitabilityCriteria = () => {
  const [criteria, setCriteria] = useState<SuitabilityCriterion[]>(initialCriteria);
  const [showCriteriaForm, setShowCriteriaForm] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<SuitabilityCriterion | undefined>();

  const handleAddCriterion = (data: any) => {
    const newCriterion: SuitabilityCriterion = {
      id: Date.now().toString(),
      ...data,
    };
    setCriteria([...criteria, newCriterion]);
    setShowCriteriaForm(false);
    toast.success('Suitability criterion added successfully');
  };

  const handleEditCriterion = (criterion: SuitabilityCriterion) => {
    setEditingCriterion(criterion);
    setShowCriteriaForm(true);
  };

  const handleUpdateCriterion = (data: any) => {
    if (editingCriterion) {
      setCriteria(criteria.map(c => 
        c.id === editingCriterion.id 
          ? { ...editingCriterion, ...data }
          : c
      ));
      setShowCriteriaForm(false);
      setEditingCriterion(undefined);
      toast.success('Suitability criterion updated successfully');
    }
  };

  const handleDeleteCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
    toast.success('Suitability criterion deleted successfully');
  };

  const handleCancelForm = () => {
    setShowCriteriaForm(false);
    setEditingCriterion(undefined);
  };

  return {
    criteria,
    showCriteriaForm,
    editingCriterion,
    setShowCriteriaForm,
    handleAddCriterion,
    handleEditCriterion,
    handleUpdateCriterion,
    handleDeleteCriterion,
    handleCancelForm,
  };
};
