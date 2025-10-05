import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Leaf, Calculator } from 'lucide-react';
import { toast } from 'sonner';

interface CropCalendarCWRStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CropCalendarCWRStep: React.FC<CropCalendarCWRStepProps> = ({ data, onUpdate, onNext }) => {
  const [selectedCrops, setSelectedCrops] = useState<string[]>(data.cropCalendar?.crops || []);
  const [cropMonths, setCropMonths] = useState<Record<string, string[]>>(data.cropCalendar?.months || {});
  const [isCalculating, setIsCalculating] = useState(false);
  const [cwrResults, setCwrResults] = useState(data.cropCalendar?.cwrResults || null);

  const crops = ['Maize', 'Rice', 'Wheat', 'Beans', 'Sunflower', 'Tomatoes'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleCropToggle = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter(c => c !== crop));
      const newMonths = { ...cropMonths };
      delete newMonths[crop];
      setCropMonths(newMonths);
    } else {
      setSelectedCrops([...selectedCrops, crop]);
      setCropMonths({ ...cropMonths, [crop]: [] });
    }
  };

  const handleMonthToggle = (crop: string, month: string) => {
    const currentMonths = cropMonths[crop] || [];
    if (currentMonths.includes(month)) {
      setCropMonths({
        ...cropMonths,
        [crop]: currentMonths.filter(m => m !== month)
      });
    } else {
      setCropMonths({
        ...cropMonths,
        [crop]: [...currentMonths, month]
      });
    }
  };

  const handleRunModel = async () => {
    if (selectedCrops.length === 0) {
      toast.error('Please select at least one crop');
      return;
    }

    setIsCalculating(true);
    // Simulate model calculation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResults = {
      totalWaterRequirement: 5500,
      peakDemand: 8.5,
      averageDemand: 5.2,
      crops: selectedCrops.map(crop => ({
        name: crop,
        kcValue: (0.7 + Math.random() * 0.5).toFixed(2),
        waterNeed: (4 + Math.random() * 3).toFixed(1)
      }))
    };

    setCwrResults(mockResults);
    setIsCalculating(false);
    toast.success('CWR model completed successfully!');
  };

  const handleNext = () => {
    if (!cwrResults) {
      toast.error('Please run the CWR model first');
      return;
    }
    onUpdate({ cropCalendar: { crops: selectedCrops, months: cropMonths, cwrResults } });
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Crop Selection
          </CardTitle>
          <CardDescription>Select crops for your irrigation scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {crops.map(crop => (
              <div key={crop} className="flex items-center space-x-2">
                <Checkbox
                  id={crop}
                  checked={selectedCrops.includes(crop)}
                  onCheckedChange={() => handleCropToggle(crop)}
                />
                <Label htmlFor={crop} className="cursor-pointer">{crop}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedCrops.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Planting Calendar</CardTitle>
            <CardDescription>Select planting months for each crop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedCrops.map(crop => (
              <div key={crop} className="space-y-3">
                <Label className="text-base font-semibold">{crop}</Label>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                  {months.map(month => (
                    <button
                      key={month}
                      onClick={() => handleMonthToggle(crop, month)}
                      className={`p-2 rounded-md text-xs font-medium transition-colors ${
                        cropMonths[crop]?.includes(month)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-muted hover:bg-muted-foreground/20'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Crop Water Requirement Model
          </CardTitle>
          <CardDescription>Calculate water requirements based on selected crops</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleRunModel}
            disabled={isCalculating || selectedCrops.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running CWR Model...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Run CWR Model
              </>
            )}
          </Button>

          {cwrResults && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Model Results</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Water Requirement</p>
                  <p className="text-2xl font-bold text-emerald-600">{cwrResults.totalWaterRequirement} m³</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peak Demand</p>
                  <p className="text-2xl font-bold text-blue-600">{cwrResults.peakDemand} mm/day</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Demand</p>
                  <p className="text-2xl font-bold text-orange-600">{cwrResults.averageDemand} mm/day</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Crop Details</h4>
                <div className="space-y-2">
                  {cwrResults.crops.map((crop: any) => (
                    <div key={crop.name} className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="font-medium">{crop.name}</span>
                      <div className="flex gap-4 text-sm">
                        <span>Kc: {crop.kcValue}</span>
                        <span className="text-blue-600">{crop.waterNeed} mm/day</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700">
          Continue to Hydraulic Design
        </Button>
      </div>
    </div>
  );
};

export default CropCalendarCWRStep;
