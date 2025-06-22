
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
        <CardDescription>Select zone, regions, and districts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Zone</Label>
          <Select value={data.zone} onValueChange={onZoneChange}>
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
            <Label>Regions (Select multiple)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availableRegions.map((region) => (
                <Button
                  key={region}
                  variant={data.regions?.includes(region) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onRegionChange(region)}
                >
                  {region}
                </Button>
              ))}
            </div>
            {data.regions && data.regions.length > 0 && (
              <p className="text-sm text-stone-600 mt-2">
                Selected: {data.regions.join(', ')}
              </p>
            )}
          </div>
        )}

        {availableDistricts.length > 0 && (
          <div>
            <Label>Districts (Select multiple)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availableDistricts.map((district) => (
                <Button
                  key={district}
                  variant={data.districts?.includes(district) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onDistrictChange(district)}
                >
                  {district}
                </Button>
              ))}
            </div>
            {data.districts && data.districts.length > 0 && (
              <p className="text-sm text-stone-600 mt-2">
                Selected: {data.districts.join(', ')}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSelectionCard;
