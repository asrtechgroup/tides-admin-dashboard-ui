
import React, { useState, useEffect } from 'react';
import { ProjectInfo, ZONES, REGIONS, DISTRICTS, WATER_SOURCE_NAMES } from '@/types/project-wizard';
import ProjectDetailsCard from './cards/ProjectDetailsCard';
import LocationSelectionCard from './cards/LocationSelectionCard';
import FileUploadCard from './cards/FileUploadCard';
import MapPreviewCard from './cards/MapPreviewCard';
import WaterSourceCard from './cards/WaterSourceCard';
import CropSelectionCard from './cards/CropSelectionCard';

interface ProjectInfoStepProps {
  data: ProjectInfo;
  onUpdate: (data: ProjectInfo) => void;
}

const ProjectInfoStep: React.FC<ProjectInfoStepProps> = ({ data, onUpdate }) => {
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableWaterSourceNames, setAvailableWaterSourceNames] = useState<string[]>([]);
  const [fileCoordinates, setFileCoordinates] = useState<[number, number][]>();

  // Cleaned up: removed debug logs
  useEffect(() => {
    if (data.zone && ZONES[data.zone as keyof typeof ZONES]) {
      setAvailableRegions(ZONES[data.zone as keyof typeof ZONES]);
    } else {
      setAvailableRegions([]);
    }
  }, [data.zone]);

  useEffect(() => {
    const allDistricts: string[] = [];
    if (data.regions && data.regions.length > 0) {
      data.regions.forEach(region => {
        if (DISTRICTS[region]) {
          allDistricts.push(...DISTRICTS[region]);
        }
      });
    }
    setAvailableDistricts(allDistricts);
  }, [data.regions]);

  useEffect(() => {
    if (data.regions && data.regions.length > 0 && data.selectedWaterSource) {
      const allWaterSourceNames: string[] = [];
      data.regions.forEach(region => {
        if (WATER_SOURCE_NAMES[region] && WATER_SOURCE_NAMES[region][data.selectedWaterSource!]) {
          allWaterSourceNames.push(...WATER_SOURCE_NAMES[region][data.selectedWaterSource!]);
        }
      });
      const uniqueWaterSourceNames = [...new Set(allWaterSourceNames)];
      setAvailableWaterSourceNames(uniqueWaterSourceNames);
    } else {
      setAvailableWaterSourceNames([]);
    }
  }, [data.regions, data.selectedWaterSource]);

  const handleInputChange = (field: keyof ProjectInfo, value: any) => {
    console.log(`Updating field ${field} to:`, value);
    const updatedData = { ...data, [field]: value };
    onUpdate(updatedData);
  };

  const handleZoneChange = (zone: string) => {
    console.log('Zone change handler called with:', zone);
    const updatedData = {
      ...data,
      zone,
      regions: [],
      districts: [],
      selectedWaterSource: undefined,
      waterSourceName: undefined
    };
    onUpdate(updatedData);
  };

  const handleRegionChange = (region: string) => {
    console.log('Region change handler called with:', region);
    const updatedData = {
      ...data,
      regions: [region], // Single region selection
      districts: [],
      selectedWaterSource: undefined,
      waterSourceName: undefined
    };
    onUpdate(updatedData);
  };

  const handleDistrictChange = (district: string) => {
    console.log('District change handler called with:', district);
    const updatedData = {
      ...data,
      districts: [district] // Single district selection
    };
    onUpdate(updatedData);
  };

  const handleWaterSourceChange = (waterSource: string) => {
    console.log('Water source change handler called with:', waterSource);
    const updatedData = {
      ...data,
      selectedWaterSource: waterSource,
      waterSourceName: undefined
    };
    onUpdate(updatedData);
  };

  const handleCropChange = (crop: string) => {
    const currentCrops = data.cropVarieties || [];
    const newCrops = currentCrops.includes(crop)
      ? currentCrops.filter(c => c !== crop)
      : [...currentCrops, crop];
    handleInputChange('cropVarieties', newCrops);
  };

  const handleFileCoordinates = (coordinates: [number, number][]) => {
    console.log('File coordinates received:', coordinates);
    setFileCoordinates(coordinates);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ProjectDetailsCard data={data} onUpdate={handleInputChange} />
          <LocationSelectionCard
            data={data}
            availableRegions={availableRegions}
            availableDistricts={availableDistricts}
            onZoneChange={handleZoneChange}
            onRegionChange={handleRegionChange}
            onDistrictChange={handleDistrictChange}
          />
          <FileUploadCard 
            data={data} 
            onUpdate={handleInputChange}
            onFileCoordinates={handleFileCoordinates}
          />
        </div>

        <div className="space-y-6">
          <MapPreviewCard 
            coordinates={fileCoordinates}
            projectLocation={{ zone: data.zone, regions: data.regions }}
          />
          <WaterSourceCard
            data={data}
            availableWaterSourceNames={availableWaterSourceNames}
            onWaterSourceChange={handleWaterSourceChange}
            onUpdate={handleInputChange}
          />
          <CropSelectionCard data={data} onCropChange={handleCropChange} />
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoStep;
