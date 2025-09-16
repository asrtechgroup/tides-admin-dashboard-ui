import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, MapPin, FileText, Map } from 'lucide-react';
import { toast } from 'sonner';
import { ZONES, REGIONS, DISTRICTS } from '@/types/project-wizard';

interface ProjectBasicInfo {
  id?: string;
  projectName: string;
  description: string;
  zone: string;
  region: string;
  district: string;
  schemeName: string;
  totalArea: number;
  potentialArea: number;
  gisFiles: File[];
}

interface ProjectBasicInfoStepProps {
  data: ProjectBasicInfo | null;
  onUpdate: (data: ProjectBasicInfo) => void;
  onNext: () => void;
}

const ProjectBasicInfoStep: React.FC<ProjectBasicInfoStepProps> = ({
  data,
  onUpdate,
  onNext
}) => {
  const [formData, setFormData] = useState<ProjectBasicInfo>({
    projectName: data?.projectName || '',
    description: data?.description || '',
    zone: data?.zone || '',
    region: data?.region || '',
    district: data?.district || '',
    schemeName: data?.schemeName || '',
    totalArea: data?.totalArea || 0,
    potentialArea: data?.potentialArea || 0,
    gisFiles: data?.gisFiles || []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof ProjectBasicInfo, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const extension = file.name.toLowerCase().split('.').pop();
      return ['shp', 'kmz', 'kml', 'geojson'].includes(extension || '');
    });

    if (validFiles.length !== files.length) {
      toast.error('Only Shapefile (.shp), KMZ, KML, and GeoJSON files are supported');
    }

    setFormData(prev => ({
      ...prev,
      gisFiles: [...prev.gisFiles, ...validFiles]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gisFiles: prev.gisFiles.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.zone) newErrors.zone = 'Zone is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.schemeName.trim()) newErrors.schemeName = 'Scheme name is required';
    if (!formData.totalArea || formData.totalArea <= 0) newErrors.totalArea = 'Total area must be greater than 0';
    if (!formData.potentialArea || formData.potentialArea <= 0) newErrors.potentialArea = 'Potential area must be greater than 0';
    if (formData.potentialArea > formData.totalArea) newErrors.potentialArea = 'Potential area cannot exceed total area';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.projectName);
      submitData.append('description', formData.description);
      submitData.append('zone', formData.zone);
      submitData.append('region', formData.region);
      submitData.append('district', formData.district);
      submitData.append('scheme_name', formData.schemeName);
      submitData.append('total_area', formData.totalArea.toString());
      submitData.append('potential_area', formData.potentialArea.toString());
      
      formData.gisFiles.forEach((file, index) => {
        submitData.append(`gis_file_${index}`, file);
      });

      // TODO: Implement API call to POST /api/projects/
      // const response = await projectAPI.createProject(submitData);
      
      // For now, simulate API response
      const projectId = Date.now().toString();
      const projectWithId = { ...formData, id: projectId };
      
      onUpdate(projectWithId);
      toast.success('Project basic information saved successfully');
      onNext();
      
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project information');
    } finally {
      setLoading(false);
    }
  };

  const availableRegions = ZONES[formData.zone] || [];
  const availableDistricts = DISTRICTS[formData.region] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Project Basic Information
        </CardTitle>
        <CardDescription>
          Enter the basic details of your irrigation project and upload GIS files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="Enter project name"
                className={errors.projectName ? 'border-destructive' : ''}
              />
              {errors.projectName && <p className="text-destructive text-sm">{errors.projectName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="schemeName">Scheme Name *</Label>
              <Input
                id="schemeName"
                value={formData.schemeName}
                onChange={(e) => handleInputChange('schemeName', e.target.value)}
                placeholder="Enter irrigation scheme name"
                className={errors.schemeName ? 'border-destructive' : ''}
              />
              {errors.schemeName && <p className="text-destructive text-sm">{errors.schemeName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalArea">Total Area (ha) *</Label>
                <Input
                  id="totalArea"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.totalArea || ''}
                  onChange={(e) => handleInputChange('totalArea', parseFloat(e.target.value) || 0)}
                  placeholder="Total area"
                  className={errors.totalArea ? 'border-destructive' : ''}
                />
                {errors.totalArea && <p className="text-destructive text-sm">{errors.totalArea}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="potentialArea">Potential Area (ha) *</Label>
                <Input
                  id="potentialArea"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.potentialArea || ''}
                  onChange={(e) => handleInputChange('potentialArea', parseFloat(e.target.value) || 0)}
                  placeholder="Irrigable area"
                  className={errors.potentialArea ? 'border-destructive' : ''}
                />
                {errors.potentialArea && <p className="text-destructive text-sm">{errors.potentialArea}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter project description and objectives"
                rows={4}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="zone">Zone *</Label>
              <Select
                value={formData.zone}
                onValueChange={(value) => {
                  handleInputChange('zone', value);
                  handleInputChange('region', '');
                  handleInputChange('district', '');
                }}
              >
                <SelectTrigger className={errors.zone ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ZONES).map((zone) => (
                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.zone && <p className="text-destructive text-sm">{errors.zone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => {
                  handleInputChange('region', value);
                  handleInputChange('district', '');
                }}
                disabled={!formData.zone}
              >
                <SelectTrigger className={errors.region ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {availableRegions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-destructive text-sm">{errors.region}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Select
                value={formData.district}
                onValueChange={(value) => handleInputChange('district', value)}
                disabled={!formData.region}
              >
                <SelectTrigger className={errors.district ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>{district}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && <p className="text-destructive text-sm">{errors.district}</p>}
            </div>

            {/* GIS File Upload */}
            <div className="space-y-2">
              <Label>GIS Files (Optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept=".shp,.kmz,.kml,.geojson"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="gis-upload"
                />
                <label htmlFor="gis-upload" className="cursor-pointer">
                  <Map className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload GIS files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: Shapefile (.shp), KMZ, KML, GeoJSON
                  </p>
                </label>
              </div>
              
              {formData.gisFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files:</Label>
                  {formData.gisFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading} size="lg">
            {loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectBasicInfoStep;