import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { TechnologyEntry } from '@/types/irrigation';
import { toast } from '@/hooks/use-toast';

interface TechnologyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (technology: Partial<TechnologyEntry>) => void;
  technology?: TechnologyEntry | null;
}

interface FormData {
  technology_name: 'surface' | 'subsurface' | 'pressurized';
  irrigation_type: string;
  description: string;
  efficiency: string;
  water_requirement: string;
  maintenance_level: 'low' | 'medium' | 'high';
  lifespan: string;
  suitable_soil_types: string[];
  suitable_crop_types: string[];
  suitable_farm_sizes: string[];
  water_quality_requirements: string[];
  suitable_topography: string[];
  climate_zones: string[];
}

const TechnologyForm: React.FC<TechnologyFormProps> = ({
  open,
  onOpenChange,
  onSave,
  technology
}) => {
  const [formData, setFormData] = useState<FormData>({
    technology_name: 'surface',
    irrigation_type: '',
    description: '',
    efficiency: '',
    water_requirement: '',
    maintenance_level: 'low',
    lifespan: '',
    suitable_soil_types: [],
    suitable_crop_types: [],
    suitable_farm_sizes: [],
    water_quality_requirements: [],
    suitable_topography: [],
    climate_zones: []
  });

  const [newTag, setNewTag] = useState('');
  const [activeTagField, setActiveTagField] = useState<keyof FormData | null>(null);

  useEffect(() => {
    if (technology) {
      setFormData({
        technology_name: technology.technology_name,
        irrigation_type: technology.irrigation_type,
        description: technology.description || '',
        efficiency: technology.efficiency.toString(),
        water_requirement: technology.water_requirement.toString(),
        maintenance_level: technology.maintenance_level,
        lifespan: technology.lifespan.toString(),
        suitable_soil_types: technology.suitable_soil_types || [],
        suitable_crop_types: technology.suitable_crop_types || [],
        suitable_farm_sizes: technology.suitable_farm_sizes || [],
        water_quality_requirements: technology.water_quality_requirements || [],
        suitable_topography: technology.suitable_topography || [],
        climate_zones: technology.climate_zones || []
      });
    } else {
      setFormData({
        technology_name: 'surface',
        irrigation_type: '',
        description: '',
        efficiency: '',
        water_requirement: '',
        maintenance_level: 'low',
        lifespan: '',
        suitable_soil_types: [],
        suitable_crop_types: [],
        suitable_farm_sizes: [],
        water_quality_requirements: [],
        suitable_topography: [],
        climate_zones: []
      });
    }
  }, [technology, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const technologyData: Partial<TechnologyEntry> = {
        ...formData,
        efficiency: parseFloat(formData.efficiency),
        water_requirement: parseFloat(formData.water_requirement),
        lifespan: parseInt(formData.lifespan, 10)
      };

      if (technology?.id) {
        technologyData.id = technology.id;
      }

      onSave(technologyData);
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: `Technology ${technology ? 'updated' : 'created'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save technology",
        variant: "destructive"
      });
    }
  };

  const addTag = (fieldName: keyof FormData) => {
    if (newTag.trim() && activeTagField === fieldName) {
      const currentTags = formData[fieldName] as string[];
      if (!currentTags.includes(newTag.trim())) {
        setFormData({
          ...formData,
          [fieldName]: [...currentTags, newTag.trim()]
        });
      }
      setNewTag('');
      setActiveTagField(null);
    }
  };

  const removeTag = (fieldName: keyof FormData, tagToRemove: string) => {
    const currentTags = formData[fieldName] as string[];
    setFormData({
      ...formData,
      [fieldName]: currentTags.filter(tag => tag !== tagToRemove)
    });
  };

  const renderTagField = (fieldName: keyof FormData, label: string) => {
    const tags = formData[fieldName] as string[];
    
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeTag(fieldName, tag)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={activeTagField === fieldName ? newTag : ''}
            onChange={(e) => {
              setNewTag(e.target.value);
              setActiveTagField(fieldName);
            }}
            placeholder={`Add ${label.toLowerCase()}`}
            onKeyPress={(e) => e.key === 'Enter' && addTag(fieldName)}
          />
          <Button 
            type="button" 
            onClick={() => addTag(fieldName)}
            disabled={!newTag.trim() || activeTagField !== fieldName}
          >
            Add
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {technology ? 'Edit Technology' : 'Add New Technology'}
          </DialogTitle>
          <DialogDescription>
            Configure irrigation technology specifications and suitability criteria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="technology_name">Technology Name</Label>
              <Select
                value={formData.technology_name}
                onValueChange={(value: 'surface' | 'subsurface' | 'pressurized') => 
                  setFormData({ ...formData, technology_name: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="surface">Surface Irrigation Technology</SelectItem>
                  <SelectItem value="subsurface">Subsurface Irrigation Technology</SelectItem>
                  <SelectItem value="pressurized">Pressurized Irrigation Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="irrigation_type">Irrigation Type</Label>
              <Input
                id="irrigation_type"
                value={formData.irrigation_type}
                onChange={(e) => setFormData({ ...formData, irrigation_type: e.target.value })}
                placeholder="e.g., Drip Irrigation"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the technology and its applications"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="efficiency">Efficiency (%)</Label>
              <Input
                id="efficiency"
                type="number"
                step="0.01"
                value={formData.efficiency}
                onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="water_requirement">Water Requirement (L/m²/day)</Label>
              <Input
                id="water_requirement"
                type="number"
                step="0.01"
                value={formData.water_requirement}
                onChange={(e) => setFormData({ ...formData, water_requirement: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifespan">Lifespan (years)</Label>
              <Input
                id="lifespan"
                type="number"
                value={formData.lifespan}
                onChange={(e) => setFormData({ ...formData, lifespan: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenance_level">Maintenance Level</Label>
            <Select
              value={formData.maintenance_level}
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setFormData({ ...formData, maintenance_level: value })
              }
            >
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Suitability Criteria</h3>
            
            {renderTagField('suitable_soil_types', 'Suitable Soil Types')}
            {renderTagField('suitable_crop_types', 'Suitable Crop Types')}
            {renderTagField('suitable_farm_sizes', 'Suitable Farm Sizes')}
            {renderTagField('water_quality_requirements', 'Water Quality Requirements')}
            {renderTagField('suitable_topography', 'Suitable Topography')}
            {renderTagField('climate_zones', 'Climate Zones')}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {technology ? 'Update' : 'Create'} Technology
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TechnologyForm;