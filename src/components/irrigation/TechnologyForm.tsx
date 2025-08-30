import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { IrrigationTechnology } from '@/types/irrigation';

interface TechnologyFormProps {
  technology?: IrrigationTechnology;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TechnologyForm: React.FC<TechnologyFormProps> = ({ technology, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    technology_type: 'surface' as 'surface' | 'subsurface' | 'pressurized',
    description: '',
    efficiency: '',
    waterRequirement: '',
    maintenanceLevel: 'medium' as 'low' | 'medium' | 'high',
    lifespan: '',
    cost_per_unit: '',
    installation_cost: '',
    maintenance_cost: '',
    soilTypes: [] as string[],
    cropTypes: [] as string[],
    farmSizes: [] as string[],
    waterQuality: [] as string[],
    topography: [] as string[],
    climateZones: [] as string[]
  });

  useEffect(() => {
    if (technology) {
      setFormData({
        name: technology.name,
        technology_type: technology.technology_type,
        description: technology.description,
        efficiency: technology.efficiency.toString(),
        waterRequirement: technology.waterRequirement.toString(),
        maintenanceLevel: technology.maintenanceLevel,
        lifespan: technology.lifespan.toString(),
        cost_per_unit: technology.cost_per_unit?.toString() || '',
        installation_cost: technology.installation_cost?.toString() || '',
        maintenance_cost: technology.maintenance_cost?.toString() || '',
        soilTypes: technology.suitabilityCriteria?.soilTypes || [],
        cropTypes: technology.suitabilityCriteria?.cropTypes || [],
        farmSizes: technology.suitabilityCriteria?.farmSizes || [],
        waterQuality: technology.suitabilityCriteria?.waterQuality || [],
        topography: technology.suitabilityCriteria?.topography || [],
        climateZones: technology.suitabilityCriteria?.climateZones || []
      });
    }
  }, [technology]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      technology_type: formData.technology_type,
      description: formData.description,
      efficiency: parseFloat(formData.efficiency),
      waterRequirement: parseFloat(formData.waterRequirement),
      maintenanceLevel: formData.maintenanceLevel,
      lifespan: parseInt(formData.lifespan),
      cost_per_unit: parseFloat(formData.cost_per_unit),
      installation_cost: parseFloat(formData.installation_cost),
      maintenance_cost: parseFloat(formData.maintenance_cost),
      suitabilityCriteria: {
        soilTypes: formData.soilTypes,
        cropTypes: formData.cropTypes,
        farmSizes: formData.farmSizes,
        waterQuality: formData.waterQuality,
        topography: formData.topography,
        climateZones: formData.climateZones
      }
    });
  };

  const handleCheckboxChange = (category: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].includes(value)
        ? (prev[category as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[category as keyof typeof prev] as string[]), value]
    }));
  };

  const soilOptions = ['clay', 'loam', 'sandy-loam', 'sandy'];
  const cropOptions = ['vegetables', 'fruits', 'cereals', 'cash-crops'];
  const farmSizeOptions = ['small', 'medium', 'large'];
  const waterQualityOptions = ['good', 'moderate', 'poor'];
  const topographyOptions = ['flat', 'gentle-slope', 'moderate-slope', 'steep-slope'];
  const climateOptions = ['arid', 'semi-arid', 'humid', 'semi-humid'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div>
          <Label htmlFor="technology_type">Technology Type *</Label>
          <Select
            value={formData.technology_type}
            onValueChange={(value: 'surface' | 'subsurface' | 'pressurized') =>
              setFormData({ ...formData, technology_type: value, irrigation_type: '' })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="surface">Surface Irrigation</SelectItem>
              <SelectItem value="subsurface">Subsurface Irrigation</SelectItem>
              <SelectItem value="pressurized">Pressurized Irrigation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.technology_type && (
          <div>
            <Label htmlFor="irrigation_type">Irrigation Type *</Label>
            <Select
              value={formData.irrigation_type}
              onValueChange={(value: string) => setFormData({ ...formData, irrigation_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formData.technology_type === 'surface' && (
                  <>
                    <SelectItem value="furrow">Furrow</SelectItem>
                    <SelectItem value="basin">Basin</SelectItem>
                    <SelectItem value="border-strip">Border Strip</SelectItem>
                  </>
                )}
                {formData.technology_type === 'subsurface' && (
                  <>
                    <SelectItem value="drip">Drip</SelectItem>
                    <SelectItem value="subsurface-drip">Subsurface Drip</SelectItem>
                  </>
                )}
                {formData.technology_type === 'pressurized' && (
                  <>
                    <SelectItem value="sprinkler">Sprinkler</SelectItem>
                    <SelectItem value="micro-sprinkler">Micro-Sprinkler</SelectItem>
                    <SelectItem value="center-pivot">Center Pivot</SelectItem>
                    <SelectItem value="lateral-move">Lateral Move</SelectItem>
                    <SelectItem value="solid-set">Solid Set</SelectItem>
                    <SelectItem value="traveling-gun">Traveling Gun</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="cost_per_unit">Cost per Unit *</Label>
          <Input
            id="cost_per_unit"
            type="number"
            min="0"
            value={formData.cost_per_unit}
            onChange={(e) => setFormData({...formData, cost_per_unit: e.target.value})}
            placeholder="Enter cost per unit"
            required
          />
        </div>
        <div>
          <Label htmlFor="installation_cost">Installation Cost *</Label>
          <Input
            id="installation_cost"
            type="number"
            min="0"
            value={formData.installation_cost}
            onChange={(e) => setFormData({...formData, installation_cost: e.target.value})}
            placeholder="Enter installation cost"
            required
          />
        </div>
        <div>
          <Label htmlFor="maintenance_cost">Maintenance Cost *</Label>
          <Input
            id="maintenance_cost"
            type="number"
            min="0"
            value={formData.maintenance_cost}
            onChange={(e) => setFormData({...formData, maintenance_cost: e.target.value})}
            placeholder="Enter maintenance cost"
            required
          />
        </div>
      </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Describe the technology..."
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="efficiency">Efficiency (%) *</Label>
          <Input
            id="efficiency"
            type="number"
            min="0"
            max="100"
            value={formData.efficiency}
            onChange={(e) => setFormData({...formData, efficiency: e.target.value})}
            placeholder="85"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="waterRequirement">Water Requirement (L/m²/day) *</Label>
          <Input
            id="waterRequirement"
            type="number"
            step="0.1"
            value={formData.waterRequirement}
            onChange={(e) => setFormData({...formData, waterRequirement: e.target.value})}
            placeholder="2.5"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="lifespan">Lifespan (years) *</Label>
          <Input
            id="lifespan"
            type="number"
            value={formData.lifespan}
            onChange={(e) => setFormData({...formData, lifespan: e.target.value})}
            placeholder="15"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="maintenanceLevel">Maintenance Level *</Label>
        <Select value={formData.maintenanceLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({...formData, maintenanceLevel: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Suitability criteria sections */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Suitability Criteria</h3>
        
        {/* Soil Types */}
        <div>
          <Label>Suitable Soil Types</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {soilOptions.map((soil) => (
              <div key={soil} className="flex items-center space-x-2">
                <Checkbox
                  id={soil}
                  checked={formData.soilTypes.includes(soil)}
                  onCheckedChange={() => handleCheckboxChange('soilTypes', soil)}
                />
                <Label htmlFor={soil} className="capitalize">{soil}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Crop Types */}
        <div>
          <Label>Suitable Crop Types</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {cropOptions.map((crop) => (
              <div key={crop} className="flex items-center space-x-2">
                <Checkbox
                  id={crop}
                  checked={formData.cropTypes.includes(crop)}
                  onCheckedChange={() => handleCheckboxChange('cropTypes', crop)}
                />
                <Label htmlFor={crop} className="capitalize">{crop}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Farm Sizes */}
        <div>
          <Label>Suitable Farm Sizes</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {farmSizeOptions.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={size}
                  checked={formData.farmSizes.includes(size)}
                  onCheckedChange={() => handleCheckboxChange('farmSizes', size)}
                />
                <Label htmlFor={size} className="capitalize">{size}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Water Quality */}
        <div>
          <Label>Water Quality Requirements</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {waterQualityOptions.map((quality) => (
              <div key={quality} className="flex items-center space-x-2">
                <Checkbox
                  id={quality}
                  checked={formData.waterQuality.includes(quality)}
                  onCheckedChange={() => handleCheckboxChange('waterQuality', quality)}
                />
                <Label htmlFor={quality} className="capitalize">{quality}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Topography */}
        <div>
          <Label>Suitable Topography</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {topographyOptions.map((topo) => (
              <div key={topo} className="flex items-center space-x-2">
                <Checkbox
                  id={topo}
                  checked={formData.topography.includes(topo)}
                  onCheckedChange={() => handleCheckboxChange('topography', topo)}
                />
                <Label htmlFor={topo} className="capitalize">{topo.replace('-', ' ')}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Climate Zones */}
        <div>
          <Label>Climate Zones</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {climateOptions.map((climate) => (
              <div key={climate} className="flex items-center space-x-2">
                <Checkbox
                  id={climate}
                  checked={formData.climateZones.includes(climate)}
                  onCheckedChange={() => handleCheckboxChange('climateZones', climate)}
                />
                <Label htmlFor={climate} className="capitalize">{climate.replace('-', ' ')}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {technology ? 'Update' : 'Add'} Technology
        </Button>
      </div>
    </form>
  );
};

export default TechnologyForm;
