
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        <CardDescription>Select zone, region, and district in order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Zone Selection */}
        <div>
          <Label>Zone</Label>
          <Select value={data.zone || ""} onValueChange={onZoneChange}>
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

        {/* Region Selection */}
        {data.zone && availableRegions.length > 0 && (
          <div>
            <Label>Region</Label>
            <Select 
              value={(data.regions && data.regions.length > 0) ? data.regions[0] : ""} 
              onValueChange={onRegionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {availableRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* District Selection */}
        {data.regions && data.regions.length > 0 && availableDistricts.length > 0 && (
          <div>
            <Label>District</Label>
            <Select 
              value={(data.districts && data.districts.length > 0) ? data.districts[0] : ""} 
              onValueChange={onDistrictChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {availableDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Show message when no zone is selected */}
        {!data.zone && (
          <div className="text-sm text-stone-500 mt-2">
            Please select a zone first to see available regions and districts.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSelectionCard;
