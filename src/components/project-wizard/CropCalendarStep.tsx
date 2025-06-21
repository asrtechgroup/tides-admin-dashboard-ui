
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { CropCalendarEntry, MONTHS } from '@/types/project-wizard';

interface CropCalendarStepProps {
  data: CropCalendarEntry[];
  onUpdate: (data: CropCalendarEntry[]) => void;
}

const CropCalendarStep: React.FC<CropCalendarStepProps> = ({ data, onUpdate }) => {
  const addCrop = () => {
    const newCrop: CropCalendarEntry = {
      cropName: '',
      plantedMonths: new Array(12).fill(false),
      potentialArea: 0
    };
    onUpdate([...data, newCrop]);
  };

  const removeCrop = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  const updateCrop = (index: number, updates: Partial<CropCalendarEntry>) => {
    const updatedData = data.map((crop, i) => 
      i === index ? { ...crop, ...updates } : crop
    );
    onUpdate(updatedData);
  };

  const toggleMonth = (cropIndex: number, monthIndex: number) => {
    const updatedMonths = [...data[cropIndex].plantedMonths];
    updatedMonths[monthIndex] = !updatedMonths[monthIndex];
    updateCrop(cropIndex, { plantedMonths: updatedMonths });
  };

  const totalArea = data.reduce((sum, crop) => sum + crop.potentialArea, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Crop Calendar</CardTitle>
              <CardDescription>Define planting schedule and potential areas</CardDescription>
            </div>
            <Button onClick={addCrop} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Crop
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <p>No crops added yet. Click "Add Crop" to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {data.map((crop, cropIndex) => (
                <Card key={cropIndex} className="border border-stone-200">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <Label htmlFor={`crop-${cropIndex}`}>Crop Name</Label>
                          <Input
                            id={`crop-${cropIndex}`}
                            value={crop.cropName}
                            onChange={(e) => updateCrop(cropIndex, { cropName: e.target.value })}
                            placeholder="Enter crop name"
                          />
                        </div>
                        <div className="w-32">
                          <Label htmlFor={`area-${cropIndex}`}>Area (ha)</Label>
                          <Input
                            id={`area-${cropIndex}`}
                            type="number"
                            value={crop.potentialArea}
                            onChange={(e) => updateCrop(cropIndex, { potentialArea: parseFloat(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCrop(cropIndex)}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div>
                        <Label>Planting Months</Label>
                        <div className="grid grid-cols-6 gap-2 mt-2">
                          {MONTHS.map((month, monthIndex) => (
                            <div key={month} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${cropIndex}-${monthIndex}`}
                                checked={crop.plantedMonths[monthIndex]}
                                onCheckedChange={() => toggleMonth(cropIndex, monthIndex)}
                              />
                              <Label 
                                htmlFor={`${cropIndex}-${monthIndex}`}
                                className="text-sm"
                              >
                                {month}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="bg-stone-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Potential Area:</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {totalArea.toFixed(2)} ha
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CropCalendarStep;
