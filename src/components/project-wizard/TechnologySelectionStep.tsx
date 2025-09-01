
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { TechnologySelection } from '@/types/project-wizard';
import { useTechnologySelection } from '@/hooks/useTechnologySelection';
import { Skeleton } from '@/components/ui/skeleton';

interface TechnologySelectionStepProps {
  data: TechnologySelection;
  onUpdate: (data: TechnologySelection) => void;
}

const TechnologySelectionStep: React.FC<TechnologySelectionStepProps> = ({ data, onUpdate }) => {
  const { 
    loading, 
    getTechnologyNames, 
    getIrrigationTypesForTechnology, 
    getTechnologyDetails 
  } = useTechnologySelection();

  const handleTechnologyNameChange = (value: 'surface' | 'subsurface' | 'pressurized') => {
    const irrigationTypes = getIrrigationTypesForTechnology(value);
    onUpdate({
      ...data,
      technology_name: value,
      irrigation_type: '', // Reset irrigation type when technology changes
      // Reset other fields to defaults
      efficiency: 0,
      water_requirement: 0,
      lifespan: 0,
      maintenance_level: 'medium',
      suitable_soil_types: [],
      suitable_crop_types: [],
      suitable_farm_sizes: [],
      water_quality_requirements: [],
      suitable_topography: [],
      climate_zones: []
    });
  };

  const handleIrrigationTypeChange = (value: string) => {
    const techDetails = getTechnologyDetails(data.technology_name, value);
    if (techDetails) {
      onUpdate({
        ...data,
        irrigation_type: value,
        efficiency: techDetails.efficiency,
        water_requirement: techDetails.water_requirement,
        lifespan: techDetails.lifespan,
        maintenance_level: techDetails.maintenance_level,
        suitable_soil_types: [...techDetails.suitable_soil_types],
        suitable_crop_types: [...techDetails.suitable_crop_types],
        suitable_farm_sizes: [...techDetails.suitable_farm_sizes],
        water_quality_requirements: [...techDetails.water_quality_requirements],
        suitable_topography: [...techDetails.suitable_topography],
        climate_zones: [...techDetails.climate_zones],
        description: techDetails.description || ''
      });
    } else {
      onUpdate({ ...data, irrigation_type: value });
    }
  };

  const availableIrrigationTypes = data.technology_name 
    ? getIrrigationTypesForTechnology(data.technology_name)
    : [];

  const technologyNames = getTechnologyNames();

  const handleArrayFieldChange = (field: keyof TechnologySelection, value: string, checked: boolean) => {
    const currentArray = (data[field] as string[]) || [];
    const updatedArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    onUpdate({ ...data, [field]: updatedArray });
  };

  const getTechnologyDisplayName = (name: string) => {
    switch(name) {
      case 'surface': return 'Surface Irrigation Technology';
      case 'subsurface': return 'Subsurface Irrigation Technology';  
      case 'pressurized': return 'Pressurized Irrigation Technology';
      default: return name;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Technology Selection</CardTitle>
          <CardDescription>Choose the irrigation technology type and specific irrigation method for your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Technology Name Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Technology Type</Label>
            <RadioGroup
              value={data.technology_name}
              onValueChange={handleTechnologyNameChange}
              className="grid grid-cols-1 gap-4"
            >
              {technologyNames.map((name) => (
                <div key={name} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50">
                  <RadioGroupItem value={name} id={name} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={name} className="cursor-pointer">
                      <div className="font-medium">{getTechnologyDisplayName(name)}</div>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Irrigation Type Selection */}
          {data.technology_name && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="irrigation-type">Irrigation Type</Label>
                <Select
                  value={data.irrigation_type}
                  onValueChange={handleIrrigationTypeChange}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select irrigation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIrrigationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Basic Technology Details */}
              {data.irrigation_type && (
                <>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={data.description || ''}
                      onChange={(e) => onUpdate({ ...data, description: e.target.value })}
                      placeholder="Enter technology description..."
                      rows={2}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="efficiency">Water Use Efficiency (%)</Label>
                      <Input
                        id="efficiency"
                        type="number"
                        min="0"
                        max="100"
                        value={data.efficiency}
                        onChange={(e) => onUpdate({ ...data, efficiency: Number(e.target.value) })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="water-requirement">Water Requirement (L/m²/day)</Label>
                      <Input
                        id="water-requirement"
                        type="number"
                        min="0"
                        value={data.water_requirement}
                        onChange={(e) => onUpdate({ ...data, water_requirement: Number(e.target.value) })}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lifespan">Lifespan (years)</Label>
                      <Input
                        id="lifespan"
                        type="number"
                        min="1"
                        value={data.lifespan}
                        onChange={(e) => onUpdate({ ...data, lifespan: Number(e.target.value) })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maintenance-level">Maintenance Level</Label>
                      <Select
                        value={data.maintenance_level}
                        onValueChange={(value: 'low' | 'medium' | 'high') => onUpdate({ ...data, maintenance_level: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Suitability Criteria */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Suitability Criteria</h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      {/* Soil Types */}
                      <div>
                        <Label className="text-sm font-medium">Suitable Soil Types</Label>
                        <div className="mt-2 space-y-2">
                          {['Clay', 'Sandy', 'Loam', 'Silt', 'Rocky'].map((soil) => (
                            <div key={soil} className="flex items-center space-x-2">
                              <Checkbox
                                id={`soil-${soil}`}
                                checked={data.suitable_soil_types.includes(soil)}
                                onCheckedChange={(checked) => 
                                  handleArrayFieldChange('suitable_soil_types', soil, checked as boolean)
                                }
                              />
                              <Label htmlFor={`soil-${soil}`} className="text-sm">{soil}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Crop Types */}
                      <div>
                        <Label className="text-sm font-medium">Suitable Crop Types</Label>
                        <div className="mt-2 space-y-2">
                          {['Rice', 'Wheat', 'Maize', 'Vegetables', 'Fruits', 'Cotton'].map((crop) => (
                            <div key={crop} className="flex items-center space-x-2">
                              <Checkbox
                                id={`crop-${crop}`}
                                checked={data.suitable_crop_types.includes(crop)}
                                onCheckedChange={(checked) => 
                                  handleArrayFieldChange('suitable_crop_types', crop, checked as boolean)
                                }
                              />
                              <Label htmlFor={`crop-${crop}`} className="text-sm">{crop}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Farm Sizes */}
                      <div>
                        <Label className="text-sm font-medium">Suitable Farm Sizes</Label>
                        <div className="mt-2 space-y-2">
                          {['Small (< 2 ha)', 'Medium (2-10 ha)', 'Large (> 10 ha)'].map((size) => (
                            <div key={size} className="flex items-center space-x-2">
                              <Checkbox
                                id={`size-${size}`}
                                checked={data.suitable_farm_sizes.includes(size)}
                                onCheckedChange={(checked) => 
                                  handleArrayFieldChange('suitable_farm_sizes', size, checked as boolean)
                                }
                              />
                              <Label htmlFor={`size-${size}`} className="text-sm">{size}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Topography */}
                      <div>
                        <Label className="text-sm font-medium">Suitable Topography</Label>
                        <div className="mt-2 space-y-2">
                          {['Flat', 'Gentle Slope', 'Steep Slope', 'Terraced'].map((topo) => (
                            <div key={topo} className="flex items-center space-x-2">
                              <Checkbox
                                id={`topo-${topo}`}
                                checked={data.suitable_topography.includes(topo)}
                                onCheckedChange={(checked) => 
                                  handleArrayFieldChange('suitable_topography', topo, checked as boolean)
                                }
                              />
                              <Label htmlFor={`topo-${topo}`} className="text-sm">{topo}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Water Quality */}
                      <div>
                        <Label className="text-sm font-medium">Water Quality Requirements</Label>
                        <div className="mt-2 space-y-2">
                          {['Fresh Water', 'Brackish Water', 'Treated Wastewater', 'Groundwater'].map((quality) => (
                            <div key={quality} className="flex items-center space-x-2">
                              <Checkbox
                                id={`quality-${quality}`}
                                checked={data.water_quality_requirements.includes(quality)}
                                onCheckedChange={(checked) => 
                                  handleArrayFieldChange('water_quality_requirements', quality, checked as boolean)
                                }
                              />
                              <Label htmlFor={`quality-${quality}`} className="text-sm">{quality}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Climate Zones */}
                      <div>
                        <Label className="text-sm font-medium">Suitable Climate Zones</Label>
                        <div className="mt-2 space-y-2">
                          {['Arid', 'Semi-Arid', 'Tropical', 'Temperate', 'Humid'].map((climate) => (
                            <div key={climate} className="flex items-center space-x-2">
                              <Checkbox
                                id={`climate-${climate}`}
                                checked={data.climate_zones.includes(climate)}
                                onCheckedChange={(checked) => 
                                  handleArrayFieldChange('climate_zones', climate, checked as boolean)
                                }
                              />
                              <Label htmlFor={`climate-${climate}`} className="text-sm">{climate}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {!data.technology_name && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Please select a technology type to continue</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnologySelectionStep;
