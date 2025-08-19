import { useState, useEffect } from 'react';
import { IrrigationTechnology } from '@/types/irrigation';
import { toast } from 'sonner';
import { resourcesAPI } from '@/services/api';

export const useIrrigationTechnologies = () => {
  const [technologies, setTechnologies] = useState<IrrigationTechnology[]>([]);
  const [showTechnologyForm, setShowTechnologyForm] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState<IrrigationTechnology | undefined>();

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const data: any = await resourcesAPI.getTechnologies();
        setTechnologies(data.results || data);
      } catch (error) {
        toast.error('Failed to load irrigation technologies from backend.');
        setTechnologies([]);
      }
    };
    fetchTechnologies();
  }, []);

  const handleAddTechnology = () => {
    toast.error('Backend endpoint for adding irrigation technology is missing. Please implement it.');
  };

  const handleEditTechnology = (technology: IrrigationTechnology) => {
    setEditingTechnology(technology);
    setShowTechnologyForm(true);
  };

  const handleUpdateTechnology = () => {
    toast.error('Backend endpoint for updating irrigation technology is missing. Please implement it.');
  };

  const handleDeleteTechnology = () => {
    toast.error('Backend endpoint for deleting irrigation technology is missing. Please implement it.');
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
