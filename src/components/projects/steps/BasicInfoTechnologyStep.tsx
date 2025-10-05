import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, MapPin, Droplets, Settings2 } from 'lucide-react';
import { toast } from 'sonner';

interface BasicInfoTechnologyStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isManual?: boolean;
}

const BasicInfoTechnologyStep: React.FC<BasicInfoTechnologyStepProps> = ({
  data,
  onUpdate,
  onNext,
  isManual = false
}) => {
  const [formData, setFormData] = useState({
    zone: data.basicInfo?.zone || '',
    region: data.basicInfo?.region || '',
    district: data.basicInfo?.district || '',
    schemeName: data.basicInfo?.schemeName || '',
    totalArea: data.basicInfo?.totalArea || '',
    potentialArea: data.basicInfo?.potentialArea || '',
    waterSource: data.basicInfo?.waterSource || '',
    waterSourceName: data.basicInfo?.waterSourceName || '',
    irrigationTechnology: data.basicInfo?.irrigationTechnology || '',
    irrigationEfficiency: data.basicInfo?.irrigationEfficiency || '',
    cropWaterRequirement: data.basicInfo?.cropWaterRequirement || ''
  });

  const zones = ['Northern Zone', 'Central Zone', 'Southern Zone', 'Eastern Zone', 'Western Zone'];
  const regions = ['Arusha', 'Dar es Salaam', 'Dodoma', 'Kilimanjaro', 'Mwanza'];
  const districts = ['District A', 'District B', 'District C'];
  const waterSources = ['Dam', 'River', 'Borehole', 'Canal'];
  const technologies = ['Drip Irrigation', 'Sprinkler Irrigation', 'Surface Irrigation'];

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Auto-fill irrigation efficiency based on technology
    if (field === 'irrigationTechnology') {
      let efficiency = '';
      if (value === 'Drip Irrigation') efficiency = '90%';
      else if (value === 'Sprinkler Irrigation') efficiency = '75%';
      else if (value === 'Surface Irrigation') efficiency = '60%';
      setFormData({ ...formData, [field]: value, irrigationEfficiency: efficiency });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success(`${files.length} shapefile(s) uploaded successfully`);
    }
  };

  const handleNext = () => {
    if (!formData.zone || !formData.district || !formData.irrigationTechnology) {
      toast.error('Please fill in all required fields');
      return;
    }
    onUpdate({ basicInfo: formData });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Location Information
          </CardTitle>
          <CardDescription>Select the project location details</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zone">Zone *</Label>
            <Select value={formData.zone} onValueChange={(v) => handleChange('zone', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent>
                {zones.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select value={formData.region} onValueChange={(v) => handleChange('region', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Select value={formData.district} onValueChange={(v) => handleChange('district', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="schemeName">Scheme Name</Label>
            <Input
              id="schemeName"
              value={formData.schemeName}
              onChange={(e) => handleChange('schemeName', e.target.value)}
              placeholder="Enter scheme name"
            />
          </div>
        </CardContent>
      </Card>

      {/* Area Information */}
      <Card>
        <CardHeader>
          <CardTitle>Area Specifications</CardTitle>
          <CardDescription>Define the project area details</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalArea">Total Area (hectares)</Label>
            <Input
              id="totalArea"
              type="number"
              value={formData.totalArea}
              onChange={(e) => handleChange('totalArea', e.target.value)}
              placeholder="e.g., 500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="potentialArea">Potential Irrigable Area (hectares)</Label>
            <Input
              id="potentialArea"
              type="number"
              value={formData.potentialArea}
              onChange={(e) => handleChange('potentialArea', e.target.value)}
              placeholder="e.g., 450"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="shapefiles">Upload Shapefiles (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer">
              <input
                id="shapefiles"
                type="file"
                multiple
                accept=".shp,.shx,.dbf,.prj"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="shapefiles" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop shapefiles
                </p>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Water Source */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Water Source
          </CardTitle>
          <CardDescription>Select the water source for irrigation</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="waterSource">Water Source Type</Label>
            <Select value={formData.waterSource} onValueChange={(v) => handleChange('waterSource', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select water source" />
              </SelectTrigger>
              <SelectContent>
                {waterSources.map(ws => <SelectItem key={ws} value={ws}>{ws}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="waterSourceName">Water Source Name</Label>
            <Input
              id="waterSourceName"
              value={formData.waterSourceName}
              onChange={(e) => handleChange('waterSourceName', e.target.value)}
              placeholder="e.g., Nyumba ya Mungu Dam"
            />
          </div>
        </CardContent>
      </Card>

      {/* Irrigation Technology */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-orange-600" />
            Irrigation Technology
          </CardTitle>
          <CardDescription>Select the irrigation system type</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="irrigationTechnology">Technology Type *</Label>
            <Select
              value={formData.irrigationTechnology}
              onValueChange={(v) => handleChange('irrigationTechnology', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select technology" />
              </SelectTrigger>
              <SelectContent>
                {technologies.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="irrigationEfficiency">Irrigation Efficiency</Label>
            <Input
              id="irrigationEfficiency"
              value={formData.irrigationEfficiency}
              readOnly
              className="bg-muted"
              placeholder="Auto-calculated"
            />
          </div>
          {isManual && (
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="cropWaterRequirement">Crop Water Requirement (mm/day)</Label>
              <Input
                id="cropWaterRequirement"
                type="number"
                step="0.1"
                value={formData.cropWaterRequirement}
                onChange={(e) => handleChange('cropWaterRequirement', e.target.value)}
                placeholder="e.g., 5.5"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700">
          Continue to Next Step
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoTechnologyStep;
