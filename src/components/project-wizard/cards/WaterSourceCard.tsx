
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
        <CardDescription>Select water source type and specific source name</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Water Source Type */}
          <div>
            <Label>Water Source Type</Label>
            <Select value={data.selectedWaterSource} onValueChange={onWaterSourceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
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

          {/* Water Source Name */}
          <div>
            <Label>Water Source Name</Label>
            <Select 
              value={data.waterSourceName} 
              onValueChange={(value) => onUpdate('waterSourceName', value)}
              disabled={!data.selectedWaterSource || availableWaterSourceNames.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !data.selectedWaterSource 
                    ? "Select type first" 
                    : availableWaterSourceNames.length === 0 
                      ? "No sources available"
                      : "Select source name"
                } />
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
        </div>

        {/* Status Messages */}
        {data.regions && data.regions.length > 0 && data.selectedWaterSource && availableWaterSourceNames.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              No {data.selectedWaterSource.toLowerCase()} sources available for the selected regions: {data.regions.join(', ')}.
            </p>
          </div>
        )}

        {(!data.regions || data.regions.length === 0) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Please select regions first to see available water sources.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaterSourceCard;
