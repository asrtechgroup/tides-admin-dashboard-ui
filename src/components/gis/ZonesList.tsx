
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trash2 } from 'lucide-react';
import { Zone } from '@/types/gis';
import { getStatusBadgeColor } from '@/utils/gis-utils';

interface ZonesListProps {
  zones: Zone[];
  selectedZone: Zone | null;
  onZoneSelect: (zone: Zone) => void;
  onDeleteZone: (zoneId: number) => void;
}

const ZonesList: React.FC<ZonesListProps> = ({
  zones,
  selectedZone,
  onZoneSelect,
  onDeleteZone
}) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Existing Zones</CardTitle>
        <CardDescription>{zones.length} zones mapped</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer border-2 ${
                selectedZone?.id === zone.id ? 'border-emerald-300' : 'border-transparent'
              }`}
              onClick={() => onZoneSelect(zone)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-stone-800 text-sm">
                    {zone.name}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    {zone.area} • {zone.irrigationType}
                  </p>
                  {zone.cropType && (
                    <p className="text-xs text-stone-500 mt-1">
                      Crop: {zone.cropType}
                    </p>
                  )}
                  <Badge className={`text-xs mt-2 ${getStatusBadgeColor(zone.status)}`}>
                    {zone.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteZone(zone.id);
                    }}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ZonesList;
