import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { materialsAPI } from '@/services/api';

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

export const useSuitabilityCriteria = () => {
  const [criteria, setCriteria] = useState<SuitabilityCriterion[]>([]);
  const [showCriteriaForm, setShowCriteriaForm] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<SuitabilityCriterion | undefined>();

  // Fetch from backend on mount and after any change
  const fetchCriteria = async () => {
    try {
      const data: any = await materialsAPI.getSuitabilityCriteria();
      setCriteria(data.results || data);
    } catch (error) {
      toast.error('Failed to load suitability criteria from backend.');
      setCriteria([]);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  const handleAddCriterion = async (data: any) => {
    try {
      await materialsAPI.createSuitabilityCriterion(data);
      toast.success('Suitability criterion added successfully');
      setShowCriteriaForm(false);
      fetchCriteria();
    } catch (error) {
      toast.error('Failed to add suitability criterion.');
    }
  };

  const handleEditCriterion = (criterion: SuitabilityCriterion) => {
    setEditingCriterion(criterion);
    setShowCriteriaForm(true);
  };

  const handleUpdateCriterion = async (data: any) => {
    if (!editingCriterion) return;
    try {
      await materialsAPI.updateSuitabilityCriterion(editingCriterion.id, data);
      toast.success('Suitability criterion updated successfully');
      setShowCriteriaForm(false);
      setEditingCriterion(undefined);
      fetchCriteria();
    } catch (error) {
      toast.error('Failed to update suitability criterion.');
    }
  };

  const handleDeleteCriterion = async (id: string) => {
    try {
      await materialsAPI.deleteSuitabilityCriterion(id);
      toast.success('Suitability criterion deleted successfully');
      fetchCriteria();
    } catch (error) {
      toast.error('Failed to delete suitability criterion.');
    }
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
