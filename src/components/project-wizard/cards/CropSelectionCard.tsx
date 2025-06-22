
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ProjectInfo, CROP_VARIETIES } from '@/types/project-wizard';

interface CropSelectionCardProps {
  data: ProjectInfo;
  onCropChange: (crop: string) => void;
}

const CropSelectionCard: React.FC<CropSelectionCardProps> = ({ data, onCropChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Crop Varieties</CardTitle>
        <CardDescription>Select crops for your irrigation scheme</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Available Crops</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {CROP_VARIETIES.map((crop) => (
              <Button
                key={crop}
                variant={data.cropVarieties?.includes(crop) ? "default" : "outline"}
                size="sm"
                onClick={() => onCropChange(crop)}
              >
                {crop}
              </Button>
            ))}
          </div>
          {data.cropVarieties && data.cropVarieties.length > 0 && (
            <p className="text-sm text-stone-600 mt-2">
              Selected: {data.cropVarieties.join(', ')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CropSelectionCard;
