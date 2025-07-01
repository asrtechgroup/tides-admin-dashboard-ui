
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
    name: '',
    type: 'drip' as 'drip' | 'sprinkler' | 'micro-spray' | 'surface' | 'subsurface',
    description: '',
    efficiency: '',
    waterRequirement: '',
    maintenanceLevel: 'medium' as 'low' | 'medium' | 'high',
    lifespan: '',
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
        type: technology.type,
        description: technology.description,
        efficiency: technology.efficiency.toString(),
        waterRequirement: technology.waterRequirement.toString(),
        maintenanceLevel: technology.maintenanceLevel,
        lifespan: technology.lifespan.toString(),
        soilTypes: technology.suitabilityCriteria.soilTypes,
        cropTypes: technology.suitabilityCriteria.cropTypes,
        farmSizes: technology.suitabilityCriteria.farmSizes,
        waterQuality: technology.suitabilityCriteria.waterQuality,
        topography: technology.suitabilityCriteria.topography,
        climateZones: technology.suitabilityCriteria.climateZones
      });
    }
  }, [technology]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      type: formData.type,
      description: formData.description,
      efficiency: parseFloat(formData.efficiency),
      waterRequirement: parseFloat(formData.waterRequirement),
      maintenanceLevel: formData.maintenanceLevel,
      lifespan: parseInt(formData.lifespan),
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
          <Label htmlFor="name">Technology Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter technology name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="type">Type *</Label>
          <Select value={formData.type} onValueChange={(value: 'drip' | 'sprinkler' | 'micro-spray' | 'surface' | 'subsurface') => setFormData({...formData, type: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="drip">Drip</SelectItem>
              <SelectItem value="sprinkler">Sprinkler</SelectItem>
              <SelectItem value="micro-spray">Micro-spray</SelectItem>
              <SelectItem value="surface">Surface</SelectItem>
              <SelectItem value="subsurface">Subsurface</SelectItem>
            </SelectContent>
          </Select>
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
