
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TechnologySelection, TECHNOLOGY_TYPES } from '@/types/project-wizard';

interface TechnologySelectionStepProps {
  data: TechnologySelection;
  onUpdate: (data: TechnologySelection) => void;
}

const TechnologySelectionStep: React.FC<TechnologySelectionStepProps> = ({ data, onUpdate }) => {
  const handleTechnologyTypeChange = (value: 'surface' | 'subsurface' | 'pressurized') => {
    onUpdate({
      ...data,
      technologyType: value,
      irrigationType: '', // Reset irrigation type when technology type changes
      efficiency: getDefaultEfficiency(value)
    });
  };

  const getDefaultEfficiency = (type: string): number => {
    switch (type) {
      case 'surface': return 60;
      case 'subsurface': return 90;
      case 'pressurized': return 85;
      default: return 0;
    }
  };

  const availableIrrigationTypes = data.technologyType 
    ? TECHNOLOGY_TYPES[data.technologyType].irrigationTypes 
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Technology Selection</CardTitle>
          <CardDescription>Choose the irrigation technology type and specific irrigation method for your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Technology Type</Label>
            <RadioGroup
              value={data.technologyType}
              onValueChange={handleTechnologyTypeChange}
              className="grid grid-cols-1 gap-4"
            >
              {Object.entries(TECHNOLOGY_TYPES).map(([key, tech]) => (
                <div key={key} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-stone-50">
                  <RadioGroupItem value={key} id={key} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={key} className="cursor-pointer">
                      <div className="font-medium">{tech.name}</div>
                      <div className="text-sm text-stone-600 mt-1">
                        {tech.irrigationTypes.join(', ')}
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {data.technologyType && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="irrigation-type">Irrigation Type</Label>
                <Select
                  value={data.irrigationType}
                  onValueChange={(value) => onUpdate({ ...data, irrigationType: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select irrigation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIrrigationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="efficiency">Water Use Efficiency (%)</Label>
                  <div className="mt-2 p-3 bg-stone-50 rounded-md">
                    <span className="text-lg font-medium text-emerald-600">
                      {data.efficiency}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="specifications">Technology Specifications (Optional)</Label>
                <Textarea
                  id="specifications"
                  value={data.specifications}
                  onChange={(e) => onUpdate({ ...data, specifications: e.target.value })}
                  placeholder="Enter any specific technical requirements or notes..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {!data.technologyType && (
            <div className="text-center py-8 text-stone-500">
              <p>Please select a technology type to continue</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnologySelectionStep;
