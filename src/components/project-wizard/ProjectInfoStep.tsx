
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Upload, Map } from 'lucide-react';
import { ProjectInfo, WATER_SOURCES, CROP_VARIETIES } from '@/types/project-wizard';
import { useToast } from '@/hooks/use-toast';
import 'leaflet/dist/leaflet.css';

interface ProjectInfoStepProps {
  data: ProjectInfo;
  onUpdate: (data: ProjectInfo) => void;
}

const ProjectInfoStep: React.FC<ProjectInfoStepProps> = ({ data, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ProjectInfo, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock file upload - replace with actual API call
      console.log('Uploading file:', file);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
      // Mock setting soil type detection
      setTimeout(() => {
        handleInputChange('soilType', 'Loamy Clay');
        toast({
          title: "Soil Type Detected",
          description: "Soil analysis complete: Loamy Clay",
        });
      }, 2000);
    }
  };

  const handleMultiSelectChange = (field: 'waterSources' | 'cropVarieties', value: string) => {
    const currentValues = data[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    handleInputChange(field, newValues);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Details</CardTitle>
              <CardDescription>Basic project information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={data.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Project description"
                />
              </div>
              
              <div>
                <Label htmlFor="zone">Zone</Label>
                <Input
                  id="zone"
                  value={data.zone}
                  onChange={(e) => handleInputChange('zone', e.target.value)}
                  placeholder="Enter zone"
                />
              </div>
              
              <div>
                <Label htmlFor="schemeName">Scheme Name</Label>
                <Input
                  id="schemeName"
                  value={data.schemeName}
                  onChange={(e) => handleInputChange('schemeName', e.target.value)}
                  placeholder="Enter scheme name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">File Upload</CardTitle>
              <CardDescription>Upload shapefile or KMZ file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Shapefile/KMZ
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".shp,.kmz,.kml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {data.soilType && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Detected Soil Type:</strong> {data.soilType}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Map className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-lg">Map Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-lg overflow-hidden border border-stone-200">
                <MapContainer
                  center={[21.1458, 79.0882]}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Water Sources & Crops</CardTitle>
              <CardDescription>Select applicable water sources and crop varieties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Water Sources</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {WATER_SOURCES.map((source) => (
                    <Button
                      key={source}
                      variant={data.waterSources?.includes(source) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleMultiSelectChange('waterSources', source)}
                    >
                      {source}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Crop Varieties</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {CROP_VARIETIES.map((crop) => (
                    <Button
                      key={crop}
                      variant={data.cropVarieties?.includes(crop) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleMultiSelectChange('cropVarieties', crop)}
                    >
                      {crop}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoStep;
