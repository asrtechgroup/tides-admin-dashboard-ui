import { useState, useEffect } from 'react';
import { TechnologyEntry } from '@/types/irrigation';
import { toast } from 'sonner';
import { resourcesAPI } from '@/services/api';

export const useTechnologySelection = () => {
  const [technologies, setTechnologies] = useState<TechnologyEntry[]>([]);
  const [availableIrrigationTypes, setAvailableIrrigationTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        const data = await resourcesAPI.getTechnologies();
        setTechnologies(data as TechnologyEntry[]);
      } catch (error) {
        console.error('Failed to load technology options:', error);
        toast.error('Failed to load technology options');
        setTechnologies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTechnologies();
  }, []);

  const getIrrigationTypesForTechnology = (technologyName: string): string[] => {
    const techTypes = technologies
      .filter(tech => tech.technology_name === technologyName)
      .map(tech => tech.irrigation_type);
    return [...new Set(techTypes)]; // Remove duplicates
  };

  const getTechnologyNames = (): Array<'surface' | 'subsurface' | 'pressurized'> => {
    const names = technologies.map(tech => tech.technology_name);
    return [...new Set(names)] as Array<'surface' | 'subsurface' | 'pressurized'>;
  };

  const getTechnologyDetails = (technologyName: string, irrigationType: string): TechnologyEntry | undefined => {
    return technologies.find(tech => 
      tech.technology_name === technologyName && tech.irrigation_type === irrigationType
    );
  };

  return {
    technologies,
    availableIrrigationTypes,
    loading,
    getIrrigationTypesForTechnology,
    getTechnologyNames,
    getTechnologyDetails,
    setAvailableIrrigationTypes
  };
};