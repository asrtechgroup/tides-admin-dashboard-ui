
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save } from 'lucide-react';
import { Zone, ZoneFormData, irrigationTypes } from '@/types/gis';

interface ZonePropertiesPanelProps {
  selectedZone: Zone | null;
  isEditing: boolean;
  formData: ZoneFormData;
  setFormData: (data: ZoneFormData) => void;
  setIsEditing: (editing: boolean) => void;
  onSaveZone: () => void;
}

const ZonePropertiesPanel: React.FC<ZonePropertiesPanelProps> = ({
  selectedZone,
  isEditing,
  formData,
  setFormData,
  setIsEditing,
  onSaveZone
}) => {
  if (!selectedZone) return null;

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Zone Properties</CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="zoneName">Zone Name</Label>
          <Input
            id="zoneName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isEditing}
            placeholder="Enter zone name"
          />
        </div>
        <div>
          <Label htmlFor="irrigationType">Irrigation Type</Label>
          <Select
            value={formData.irrigationType}
            onValueChange={(value) => setFormData({ ...formData, irrigationType: value })}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {irrigationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cropType">Crop Type</Label>
          <Input
            id="cropType"
            value={formData.cropType}
            onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
            disabled={!isEditing}
            placeholder="e.g., Wheat, Cotton"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'Planned' | 'Active' | 'Completed') => 
              setFormData({ ...formData, status: value })}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-stone-600">
          Area: {selectedZone.area}
        </div>
        {isEditing && (
          <div className="flex space-x-2">
            <Button 
              onClick={onSaveZone}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Zone
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ZonePropertiesPanel;
