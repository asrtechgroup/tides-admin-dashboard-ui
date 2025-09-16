import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CROP_VARIETIES, MONTHS } from '@/types/project-wizard';

interface CropEntry {
  id: string;
  cropName: string;
  plantingDate: string;
  harvestDate: string;
  area: number;
  growthStageDurations: {
    initial: number;
    development: number;
    midSeason: number;
    lateseason: number;
  };
  waterRequirement?: {
    netWaterRequirement: number;
    grossWaterRequirement: number;
    monthlyDemand: { month: string; demand: number }[];
  };
}

interface CropCalendarData {
  crops: CropEntry[];
  totalWaterRequirement: {
    net: number;
    gross: number;
  };
}

interface CropCalendarStepProps {
  data: CropCalendarData | null;
  projectId?: string;
  onUpdate: (data: CropCalendarData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CropCalendarStep: React.FC<CropCalendarStepProps> = ({
  data,
  projectId,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [crops, setCrops] = useState<CropEntry[]>(data?.crops || []);
  const [loading, setLoading] = useState(false);
  const [calculatingWater, setCalculatingWater] = useState(false);

  const addCrop = () => {
    const newCrop: CropEntry = {
      id: Date.now().toString(),
      cropName: '',
      plantingDate: '',
      harvestDate: '',
      area: 0,
      growthStageDurations: {
        initial: 20,
        development: 30,
        midSeason: 40,
        lateseason: 30
      }
    };
    setCrops([...crops, newCrop]);
  };

  const updateCrop = (id: string, field: string, value: any) => {
    setCrops(crops.map(crop => 
      crop.id === id ? { ...crop, [field]: value } : crop
    ));
  };

  const updateGrowthStage = (id: string, stage: keyof CropEntry['growthStageDurations'], value: number) => {
    setCrops(crops.map(crop => 
      crop.id === id 
        ? { 
            ...crop, 
            growthStageDurations: { 
              ...crop.growthStageDurations, 
              [stage]: value 
            } 
          } 
        : crop
    ));
  };

  const removeCrop = (id: string) => {
    setCrops(crops.filter(crop => crop.id !== id));
  };

  const calculateWaterRequirements = async () => {
    if (crops.length === 0) {
      toast.error('Please add at least one crop');
      return;
    }

    if (!projectId) {
      toast.error('Project ID is required');
      return;
    }

    try {
      setCalculatingWater(true);
      
      // TODO: Implement API call to POST /api/projects/:id/cwr/
      // const response = await projectAPI.calculateWaterRequirements(projectId, crops);
      
      // For now, simulate water requirement calculation
      const updatedCrops = crops.map(crop => ({
        ...crop,
        waterRequirement: {
          netWaterRequirement: crop.area * 800, // Example: 800 mm/ha
          grossWaterRequirement: crop.area * 1000, // Example: 1000 mm/ha (125% efficiency)
          monthlyDemand: MONTHS.map((month, index) => ({
            month,
            demand: Math.random() * 100 + 50 // Random demand between 50-150 mm
          }))
        }
      }));

      const totalNet = updatedCrops.reduce((sum, crop) => sum + (crop.waterRequirement?.netWaterRequirement || 0), 0);
      const totalGross = updatedCrops.reduce((sum, crop) => sum + (crop.waterRequirement?.grossWaterRequirement || 0), 0);

      setCrops(updatedCrops);
      toast.success('Water requirements calculated successfully');
      
    } catch (error) {
      console.error('Error calculating water requirements:', error);
      toast.error('Failed to calculate water requirements');
    } finally {
      setCalculatingWater(false);
    }
  };

  const handleSubmit = async () => {
    if (crops.length === 0) {
      toast.error('Please add at least one crop');
      return;
    }

    const incompleteCrops = crops.filter(crop => 
      !crop.cropName || !crop.plantingDate || !crop.harvestDate || crop.area <= 0
    );

    if (incompleteCrops.length > 0) {
      toast.error('Please complete all crop information');
      return;
    }

    try {
      setLoading(true);
      
      const totalNet = crops.reduce((sum, crop) => sum + (crop.waterRequirement?.netWaterRequirement || 0), 0);
      const totalGross = crops.reduce((sum, crop) => sum + (crop.waterRequirement?.grossWaterRequirement || 0), 0);

      const cropCalendarData: CropCalendarData = {
        crops,
        totalWaterRequirement: {
          net: totalNet,
          gross: totalGross
        }
      };

      onUpdate(cropCalendarData);
      toast.success('Crop calendar saved successfully');
      onNext();
      
    } catch (error) {
      console.error('Error saving crop calendar:', error);
      toast.error('Failed to save crop calendar');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for water demand curve
  const chartData = MONTHS.map(month => {
    const monthData: any = { month };
    crops.forEach(crop => {
      if (crop.waterRequirement) {
        const monthDemand = crop.waterRequirement.monthlyDemand.find(d => d.month === month);
        monthData[crop.cropName] = monthDemand?.demand || 0;
      }
    });
    return monthData;
  });

  const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0);
  const hasWaterRequirements = crops.some(crop => crop.waterRequirement);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Crop Calendar & Water Requirements
        </CardTitle>
        <CardDescription>
          Define crops, planting schedules, and calculate water requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Crop Button */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Crop Entries</h3>
            <p className="text-sm text-muted-foreground">
              Total cultivated area: {totalArea.toFixed(1)} hectares
            </p>
          </div>
          <Button onClick={addCrop} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Crop
          </Button>
        </div>

        {/* Crop Entries */}
        <div className="space-y-4">
          {crops.map((crop, index) => (
            <Card key={crop.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Crop {index + 1}</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeCrop(crop.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Crop Type</Label>
                  <Select
                    value={crop.cropName}
                    onValueChange={(value) => updateCrop(crop.id, 'cropName', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {CROP_VARIETIES.map((cropName) => (
                        <SelectItem key={cropName} value={cropName}>
                          {cropName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Area (ha)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={crop.area || ''}
                    onChange={(e) => updateCrop(crop.id, 'area', parseFloat(e.target.value) || 0)}
                    placeholder="Enter area"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Planting Date</Label>
                  <Input
                    type="date"
                    value={crop.plantingDate}
                    onChange={(e) => updateCrop(crop.id, 'plantingDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Harvest Date</Label>
                  <Input
                    type="date"
                    value={crop.harvestDate}
                    onChange={(e) => updateCrop(crop.id, 'harvestDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Growth Stage Durations */}
              <div className="mt-4">
                <Label className="text-sm font-medium">Growth Stage Durations (days)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Initial</Label>
                    <Input
                      type="number"
                      min="1"
                      value={crop.growthStageDurations.initial}
                      onChange={(e) => updateGrowthStage(crop.id, 'initial', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Development</Label>
                    <Input
                      type="number"
                      min="1"
                      value={crop.growthStageDurations.development}
                      onChange={(e) => updateGrowthStage(crop.id, 'development', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Mid Season</Label>
                    <Input
                      type="number"
                      min="1"
                      value={crop.growthStageDurations.midSeason}
                      onChange={(e) => updateGrowthStage(crop.id, 'midSeason', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Late Season</Label>
                    <Input
                      type="number"
                      min="1"
                      value={crop.growthStageDurations.lateseason}
                      onChange={(e) => updateGrowthStage(crop.id, 'lateseason', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Water Requirements Display */}
              {crop.waterRequirement && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Net Water Requirement</Label>
                      <p className="font-medium">{crop.waterRequirement.netWaterRequirement.toFixed(0)} mm</p>
                    </div>
                    <div>
                      <Label className="text-sm">Gross Water Requirement</Label>
                      <p className="font-medium">{crop.waterRequirement.grossWaterRequirement.toFixed(0)} mm</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}

          {crops.length === 0 && (
            <Card className="p-8 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">
                No crops added yet. Click "Add Crop" to start building your crop calendar.
              </p>
            </Card>
          )}
        </div>

        {/* Calculate Water Requirements Button */}
        {crops.length > 0 && (
          <div className="flex justify-center">
            <Button 
              onClick={calculateWaterRequirements}
              disabled={calculatingWater}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              {calculatingWater ? 'Calculating...' : 'Calculate Water Requirements'}
            </Button>
          </div>
        )}

        {/* Water Demand Chart */}
        {hasWaterRequirements && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monthly Water Demand Curve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Water Demand (mm)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    {crops.map((crop, index) => (
                      crop.waterRequirement && (
                        <Line
                          key={crop.id}
                          type="monotone"
                          dataKey={crop.cropName}
                          stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
                          strokeWidth={2}
                        />
                      )
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Total Water Requirements Summary */}
        {hasWaterRequirements && (
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Total Project Water Requirements</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Badge variant="secondary">Net Water Requirement</Badge>
                  <p className="text-lg font-semibold mt-1">
                    {data?.totalWaterRequirement.net.toFixed(0) || '0'} mm
                  </p>
                </div>
                <div>
                  <Badge variant="secondary">Gross Water Requirement</Badge>
                  <p className="text-lg font-semibold mt-1">
                    {data?.totalWaterRequirement.gross.toFixed(0) || '0'} mm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Technology Selection
          </Button>
          
          <Button 
            onClick={handleSubmit} 
            disabled={loading || crops.length === 0}
          >
            {loading ? 'Saving...' : 'Next: Hydraulic Design'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropCalendarStep;