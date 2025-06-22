
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectInfo, ZONES } from '@/types/project-wizard';

interface LocationSelectionCardProps {
  data: ProjectInfo;
  availableRegions: string[];
  availableDistricts: string[];
  onZoneChange: (zone: string) => void;
  onRegionChange: (region: string) => void;
  onDistrictChange: (district: string) => void;
}

const LocationSelectionCard: React.FC<LocationSelectionCardProps> = ({
  data,
  availableRegions,
  availableDistricts,
  onZoneChange,
  onRegionChange,
  onDistrictChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Location Selection</CardTitle>
        <CardDescription>Select zone, regions, and districts in order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zone Selection - First Row */}
        <div>
          <Label>Zone</Label>
          <Select value={data.zone} onValueChange={onZoneChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select zone first" />
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

        {/* Region and District Selection - Second Row */}
        {data.zone && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Regions Selection */}
            <div>
              <Label>Regions (Select multiple)</Label>
              <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto">
                {availableRegions.map((region) => (
                  <Button
                    key={region}
                    variant={data.regions?.includes(region) ? "default" : "outline"}
                    size="sm"
                    onClick={() => onRegionChange(region)}
                    className="text-left justify-start"
                  >
                    {region}
                  </Button>
                ))}
              </div>
              {data.regions && data.regions.length > 0 && (
                <p className="text-xs text-stone-600 mt-2">
                  Selected: {data.regions.join(', ')}
                </p>
              )}
              {availableRegions.length === 0 && (
                <p className="text-sm text-stone-500 mt-2">Select a zone first</p>
              )}
            </div>

            {/* Districts Selection */}
            <div>
              <Label>Districts (Select multiple)</Label>
              <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto">
                {availableDistricts.map((district) => (
                  <Button
                    key={district}
                    variant={data.districts?.includes(district) ? "default" : "outline"}
                    size="sm"
                    onClick={() => onDistrictChange(district)}
                    className="text-left justify-start"
                  >
                    {district}
                  </Button>
                ))}
              </div>
              {data.districts && data.districts.length > 0 && (
                <p className="text-xs text-stone-600 mt-2">
                  Selected: {data.districts.join(', ')}
                </p>
              )}
              {data.regions && data.regions.length > 0 && availableDistricts.length === 0 && (
                <p className="text-sm text-stone-500 mt-2">No districts available for selected regions</p>
              )}
              {(!data.regions || data.regions.length === 0) && (
                <p className="text-sm text-stone-500 mt-2">Select regions first</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSelectionCard;
