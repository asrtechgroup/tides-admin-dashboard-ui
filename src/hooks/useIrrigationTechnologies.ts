import { useState, useEffect } from 'react';
import { IrrigationTechnology } from '@/types/irrigation';
import { toast } from 'sonner';
import { materialsAPI } from '@/services/api';

export const useIrrigationTechnologies = () => {
  const [technologies, setTechnologies] = useState<IrrigationTechnology[]>([]);
  const [showTechnologyForm, setShowTechnologyForm] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState<IrrigationTechnology | undefined>();

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const data: any = await materialsAPI.getTechnologies();
        setTechnologies(data.results || data);
      } catch (error) {
        toast.error('Failed to load irrigation technologies from backend.');
        setTechnologies([]);
      }
    };
    fetchTechnologies();
  }, []);

  const handleAddTechnology = () => {
    setShowTechnologyForm(true);
    setEditingTechnology(undefined);
  };

  const handleEditTechnology = (technology: IrrigationTechnology) => {
    setEditingTechnology(technology);
    setShowTechnologyForm(true);
  };

  const handleSubmitTechnology = async (data: any) => {
    try {
      if (editingTechnology) {
        await materialsAPI.updateTechnology(editingTechnology.id, data);
        toast.success('Technology updated successfully');
      } else {
        await materialsAPI.createTechnology(data);
        toast.success('Technology created successfully');
      }
      
      // Refresh the technologies list
      const updatedData: any = await materialsAPI.getTechnologies();
      setTechnologies(updatedData.results || updatedData);
      
      setShowTechnologyForm(false);
      setEditingTechnology(undefined);
    } catch (error) {
      toast.error(editingTechnology ? 'Failed to update technology' : 'Failed to create technology');
    }
  };

  const handleDeleteTechnology = async (id: string) => {
    try {
      await materialsAPI.deleteTechnology(id);
      toast.success('Technology deleted successfully');
      
      // Refresh the technologies list
      const updatedData: any = await materialsAPI.getTechnologies();
      setTechnologies(updatedData.results || updatedData);
    } catch (error) {
      toast.error('Failed to delete technology');
    }
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
    handleSubmitTechnology,
    handleDeleteTechnology,
    handleCancelForm,
  };
};
