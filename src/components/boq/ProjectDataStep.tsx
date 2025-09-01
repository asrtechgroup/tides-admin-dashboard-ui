import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, Droplets } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectData {
  name: string;
  location: string;
  area: number;
  irrigationType: string;
  description: string;
  startDate: string;
  endDate: string;
  waterSource: string;
  soilType: string;
}

interface ProjectDataStepProps {
  projectData: ProjectData;
  onProjectDataChange: (data: ProjectData) => void;
  onNext: () => void;
}

const ProjectDataStep: React.FC<ProjectDataStepProps> = ({
  projectData,
  onProjectDataChange,
  onNext
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ProjectData, value: string | number) => {
    onProjectDataChange({
      ...projectData,
      [field]: value
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!projectData.name.trim()) newErrors.name = 'Project name is required';
    if (!projectData.location.trim()) newErrors.location = 'Location is required';
    if (!projectData.area || projectData.area <= 0) newErrors.area = 'Area must be greater than 0';
    if (!projectData.irrigationType) newErrors.irrigationType = 'Irrigation type is required';
    if (!projectData.startDate) newErrors.startDate = 'Start date is required';
    if (!projectData.waterSource) newErrors.waterSource = 'Water source is required';
    if (!projectData.soilType) newErrors.soilType = 'Soil type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      toast.success('Project data saved successfully');
      onNext();
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Project Data Input
        </CardTitle>
        <CardDescription>
          Enter the basic information for your irrigation project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              value={projectData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter project name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={projectData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter project location"
              className={errors.location ? 'border-destructive' : ''}
            />
            {errors.location && <p className="text-destructive text-sm">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area (hectares) *</Label>
            <Input
              id="area"
              type="number"
              step="0.1"
              min="0"
              value={projectData.area || ''}
              onChange={(e) => handleInputChange('area', parseFloat(e.target.value) || 0)}
              placeholder="Enter area in hectares"
              className={errors.area ? 'border-destructive' : ''}
            />
            {errors.area && <p className="text-destructive text-sm">{errors.area}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="irrigationType">Irrigation Type *</Label>
            <Select
              value={projectData.irrigationType}
              onValueChange={(value) => handleInputChange('irrigationType', value)}
            >
              <SelectTrigger className={errors.irrigationType ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select irrigation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drip">Drip Irrigation</SelectItem>
                <SelectItem value="sprinkler">Sprinkler Irrigation</SelectItem>
                <SelectItem value="surface">Surface Irrigation</SelectItem>
                <SelectItem value="subsurface">Subsurface Irrigation</SelectItem>
                <SelectItem value="micro-spray">Micro-spray Irrigation</SelectItem>
              </SelectContent>
            </Select>
            {errors.irrigationType && <p className="text-destructive text-sm">{errors.irrigationType}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Project Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={projectData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={errors.startDate ? 'border-destructive' : ''}
            />
            {errors.startDate && <p className="text-destructive text-sm">{errors.startDate}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Expected End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={projectData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waterSource">Water Source *</Label>
            <Select
              value={projectData.waterSource}
              onValueChange={(value) => handleInputChange('waterSource', value)}
            >
              <SelectTrigger className={errors.waterSource ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select water source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="river">River</SelectItem>
                <SelectItem value="borehole">Borehole</SelectItem>
                <SelectItem value="dam">Dam/Reservoir</SelectItem>
                <SelectItem value="spring">Spring</SelectItem>
                <SelectItem value="canal">Canal</SelectItem>
              </SelectContent>
            </Select>
            {errors.waterSource && <p className="text-destructive text-sm">{errors.waterSource}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="soilType">Soil Type *</Label>
            <Select
              value={projectData.soilType}
              onValueChange={(value) => handleInputChange('soilType', value)}
            >
              <SelectTrigger className={errors.soilType ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clay">Clay</SelectItem>
                <SelectItem value="loam">Loam</SelectItem>
                <SelectItem value="sand">Sand</SelectItem>
                <SelectItem value="silt">Silt</SelectItem>
                <SelectItem value="clay-loam">Clay Loam</SelectItem>
                <SelectItem value="sandy-loam">Sandy Loam</SelectItem>
              </SelectContent>
            </Select>
            {errors.soilType && <p className="text-destructive text-sm">{errors.soilType}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Project Description</Label>
          <Textarea
            id="description"
            value={projectData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter project description and objectives"
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleNext} size="lg">
            Next: Unit Prices
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDataStep;