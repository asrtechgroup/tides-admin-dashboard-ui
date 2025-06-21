
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Upload, Map } from 'lucide-react';
import { ProjectInfo, ZONES, REGIONS, DISTRICTS, WATER_SOURCES, WATER_SOURCE_NAMES, CROP_VARIETIES } from '@/types/project-wizard';
import { useToast } from '@/hooks/use-toast';
import 'leaflet/dist/leaflet.css';

interface ProjectInfoStepProps {
  data: ProjectInfo;
  onUpdate: (data: ProjectInfo) => void;
}

const ProjectInfoStep: React.FC<ProjectInfoStepProps> = ({ data, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableWaterSourceNames, setAvailableWaterSourceNames] = useState<string[]>([]);

  useEffect(() => {
    if (data.zone && ZONES[data.zone as keyof typeof ZONES]) {
      setAvailableRegions(ZONES[data.zone as keyof typeof ZONES]);
    } else {
      setAvailableRegions([]);
    }
  }, [data.zone]);

  useEffect(() => {
    const allDistricts: string[] = [];
    data.regions.forEach(region => {
      if (DISTRICTS[region]) {
        allDistricts.push(...DISTRICTS[region]);
      }
    });
    setAvailableDistricts(allDistricts);
  }, [data.regions]);

  useEffect(() => {
    if (data.districts.length > 0 && data.selectedWaterSource) {
      const allWaterSourceNames: string[] = [];
      data.districts.forEach(district => {
        if (WATER_SOURCE_NAMES[district] && WATER_SOURCE_NAMES[district][data.selectedWaterSource!]) {
          allWaterSourceNames.push(...WATER_SOURCE_NAMES[district][data.selectedWaterSource!]);
        }
      });
      setAvailableWaterSourceNames([...new Set(allWaterSourceNames)]);
    } else {
      setAvailableWaterSourceNames([]);
    }
  }, [data.districts, data.selectedWaterSource]);

  const handleInputChange = (field: keyof ProjectInfo, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const handleZoneChange = (zone: string) => {
    handleInputChange('zone', zone);
    handleInputChange('regions', []);
    handleInputChange('districts', []);
  };

  const handleRegionChange = (region: string) => {
    const currentRegions = data.regions || [];
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter(r => r !== region)
      : [...currentRegions, region];
    handleInputChange('regions', newRegions);
    handleInputChange('districts', []);
  };

  const handleDistrictChange = (district: string) => {
    const currentDistricts = data.districts || [];
    const newDistricts = currentDistricts.includes(district)
      ? currentDistricts.filter(d => d !== district)
      : [...currentDistricts, district];
    handleInputChange('districts', newDistricts);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Uploading file:', file);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
      setTimeout(() => {
        handleInputChange('soilType', 'Loamy Clay');
        toast({
          title: "Soil Type Detected",
          description: "Soil analysis complete: Loamy Clay",
        });
      }, 2000);
    }
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
                <Label htmlFor="schemeName">Scheme Name</Label>
                <Input
                  id="schemeName"
                  value={data.schemeName}
                  onChange={(e) => handleInputChange('schemeName', e.target.value)}
                  placeholder="Enter scheme name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalArea">Total Area (Ha)</Label>
                  <Input
                    id="totalArea"
                    type="number"
                    value={data.totalArea || ''}
                    onChange={(e) => handleInputChange('totalArea', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="potentialArea">Potential Area (Ha)</Label>
                  <Input
                    id="potentialArea"
                    type="number"
                    value={data.potentialArea || ''}
                    onChange={(e) => handleInputChange('potentialArea', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location Selection</CardTitle>
              <CardDescription>Select zone, regions, and districts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Zone</Label>
                <Select value={data.zone} onValueChange={handleZoneChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(ZONES).map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {availableRegions.length > 0 && (
                <div>
                  <Label>Regions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableRegions.map((region) => (
                      <Button
                        key={region}
                        variant={data.regions?.includes(region) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleRegionChange(region)}
                      >
                        {region}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {availableDistricts.length > 0 && (
                <div>
                  <Label>Districts</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableDistricts.map((district) => (
                      <Button
                        key={district}
                        variant={data.districts?.includes(district) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDistrictChange(district)}
                      >
                        {district}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
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
              <CardTitle className="text-lg">Water Source</CardTitle>
              <CardDescription>Select water source type and specific source</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Water Source Type</Label>
                <Select value={data.selectedWaterSource} onValueChange={(value) => handleInputChange('selectedWaterSource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select water source type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WATER_SOURCES.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {availableWaterSourceNames.length > 0 && (
                <div>
                  <Label>Water Source Name</Label>
                  <Select value={data.waterSourceName} onValueChange={(value) => handleInputChange('waterSourceName', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specific water source" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWaterSourceNames.map((sourceName) => (
                        <SelectItem key={sourceName} value={sourceName}>
                          {sourceName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Crop Varieties</CardTitle>
              <CardDescription>Select crops for your irrigation scheme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Available Crops</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {CROP_VARIETIES.map((crop) => (
                    <Button
                      key={crop}
                      variant={data.cropVarieties?.includes(crop) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCropChange(crop)}
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
