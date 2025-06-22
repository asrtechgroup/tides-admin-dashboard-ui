
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

  // Debug logs to track state changes
  console.log('Current data:', data);
  console.log('Available regions:', availableRegions);
  console.log('Available districts:', availableDistricts);
  console.log('Available water source names:', availableWaterSourceNames);

  useEffect(() => {
    console.log('Zone changed to:', data.zone);
    if (data.zone && ZONES[data.zone as keyof typeof ZONES]) {
      const regions = ZONES[data.zone as keyof typeof ZONES];
      console.log('Setting available regions:', regions);
      setAvailableRegions(regions);
    } else {
      console.log('No zone selected or invalid zone, clearing regions');
      setAvailableRegions([]);
    }
  }, [data.zone]);

  useEffect(() => {
    console.log('Regions changed to:', data.regions);
    const allDistricts: string[] = [];
    data.regions.forEach(region => {
      if (DISTRICTS[region]) {
        console.log(`Adding districts for region ${region}:`, DISTRICTS[region]);
        allDistricts.push(...DISTRICTS[region]);
      }
    });
    console.log('Setting available districts:', allDistricts);
    setAvailableDistricts(allDistricts);
  }, [data.regions]);

  // Updated useEffect to use regions instead of districts for water source names
  useEffect(() => {
    console.log('Regions or water source changed:', { regions: data.regions, waterSource: data.selectedWaterSource });
    if (data.regions.length > 0 && data.selectedWaterSource) {
      const allWaterSourceNames: string[] = [];
      data.regions.forEach(region => {
        if (WATER_SOURCE_NAMES[region] && WATER_SOURCE_NAMES[region][data.selectedWaterSource!]) {
          console.log(`Adding water sources for region ${region}:`, WATER_SOURCE_NAMES[region][data.selectedWaterSource!]);
          allWaterSourceNames.push(...WATER_SOURCE_NAMES[region][data.selectedWaterSource!]);
        }
      });
      const uniqueWaterSourceNames = [...new Set(allWaterSourceNames)];
      console.log('Setting available water source names:', uniqueWaterSourceNames);
      setAvailableWaterSourceNames(uniqueWaterSourceNames);
    } else {
      console.log('No regions or water source selected, clearing water source names');
      setAvailableWaterSourceNames([]);
    }
  }, [data.regions, data.selectedWaterSource]);

  const handleInputChange = (field: keyof ProjectInfo, value: any) => {
    console.log(`Updating field ${field} to:`, value);
    onUpdate({ ...data, [field]: value });
  };

  const handleZoneChange = (zone: string) => {
    console.log('Zone change handler called with:', zone);
    handleInputChange('zone', zone);
    // Reset dependent fields when zone changes
    handleInputChange('regions', []);
    handleInputChange('districts', []);
    handleInputChange('selectedWaterSource', undefined);
    handleInputChange('waterSourceName', undefined);
  };

  const handleRegionChange = (region: string) => {
    console.log('Region change handler called with:', region);
    const currentRegions = data.regions || [];
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter(r => r !== region)
      : [...currentRegions, region];
    console.log('New regions array:', newRegions);
    handleInputChange('regions', newRegions);
    // Reset districts and water sources when regions change
    handleInputChange('districts', []);
    handleInputChange('selectedWaterSource', undefined);
    handleInputChange('waterSourceName', undefined);
  };

  const handleDistrictChange = (district: string) => {
    console.log('District change handler called with:', district);
    const currentDistricts = data.districts || [];
    const newDistricts = currentDistricts.includes(district)
      ? currentDistricts.filter(d => d !== district)
      : [...currentDistricts, district];
    console.log('New districts array:', newDistricts);
    handleInputChange('districts', newDistricts);
  };

  const handleWaterSourceChange = (waterSource: string) => {
    console.log('Water source change handler called with:', waterSource);
    handleInputChange('selectedWaterSource', waterSource);
    // Reset water source name when type changes
    handleInputChange('waterSourceName', undefined);
  };

  const handleCropChange = (crop: string) => {
    const currentCrops = data.cropVarieties || [];
    const newCrops = currentCrops.includes(crop)
      ? currentCrops.filter(c => c !== crop)
      : [...currentCrops, crop];
    handleInputChange('cropVarieties', newCrops);
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
          <FileUploadCard data={data} onUpdate={handleInputChange} />
        </div>

        <div className="space-y-6">
          <MapPreviewCard />
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
