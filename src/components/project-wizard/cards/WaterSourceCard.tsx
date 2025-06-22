
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectInfo, WATER_SOURCES } from '@/types/project-wizard';

interface WaterSourceCardProps {
  data: ProjectInfo;
  availableWaterSourceNames: string[];
  onWaterSourceChange: (waterSource: string) => void;
  onUpdate: (field: keyof ProjectInfo, value: any) => void;
}

const WaterSourceCard: React.FC<WaterSourceCardProps> = ({
  data,
  availableWaterSourceNames,
  onWaterSourceChange,
  onUpdate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Water Source</CardTitle>
        <CardDescription>Select water source type and specific source</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Water Source Type</Label>
          <Select value={data.selectedWaterSource} onValueChange={onWaterSourceChange}>
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
            <Select value={data.waterSourceName} onValueChange={(value) => onUpdate('waterSourceName', value)}>
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

        {data.districts.length > 0 && data.selectedWaterSource && availableWaterSourceNames.length === 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              No {data.selectedWaterSource.toLowerCase()} sources available for the selected districts.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaterSourceCard;
