
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, Calculator, Droplets, Target } from 'lucide-react';
import { Zone } from '@/types/gis';

interface SchemeDesignPanelProps {
  zones: Zone[];
  onGenerateBOQ: () => void;
}

const SchemeDesignPanel: React.FC<SchemeDesignPanelProps> = ({ zones, onGenerateBOQ }) => {
  const [selectedDesignType, setSelectedDesignType] = useState('surface');
  const [designGenerated, setDesignGenerated] = useState(false);

  const totalArea = zones.reduce((acc, zone) => {
    const area = parseFloat(zone.area.split(' ')[0]) || 0;
    return acc + area;
  }, 0);

  const handleGenerateDesign = () => {
    setDesignGenerated(true);
  };

  const designSpecs = {
    surface: {
      mainCanal: '2.5m width × 1.8m depth',
      distributaries: '1.2m width × 0.8m depth',
      outlets: '45 nos. @ 2 ha command',
      efficiency: '65%'
    },
    drip: {
      mainLine: '110mm HDPE pipe',
      subMain: '75mm HDPE pipe',
      laterals: '16mm PE pipe @ 1.5m spacing',
      efficiency: '90%'
    },
    sprinkler: {
      mainLine: '100mm PVC pipe',
      subMain: '75mm PVC pipe',
      risers: '25mm with sprinklers @ 12m × 12m',
      efficiency: '80%'
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Scheme Design</CardTitle>
          </div>
          <CardDescription>Design irrigation infrastructure for your zones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Design Type</label>
            <Select value={selectedDesignType} onValueChange={setSelectedDesignType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="surface">Surface Irrigation</SelectItem>
                <SelectItem value="drip">Drip Irrigation</SelectItem>
                <SelectItem value="sprinkler">Sprinkler Irrigation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-stone-50 p-3 rounded-lg">
            <h4 className="font-medium mb-2">Project Summary</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Total Area:</span>
                <span className="font-medium">{totalArea.toFixed(1)} ha</span>
              </div>
              <div className="flex justify-between">
                <span>Number of Zones:</span>
                <span className="font-medium">{zones.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Design Type:</span>
                <span className="font-medium capitalize">{selectedDesignType}</span>
              </div>
            </div>
          </div>

          {!designGenerated ? (
            <Button onClick={handleGenerateDesign} className="w-full">
              <Calculator className="w-4 h-4 mr-2" />
              Generate Design
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Design Specifications</h4>
                <div className="text-sm text-green-700 space-y-1">
                  {Object.entries(designSpecs[selectedDesignType as keyof typeof designSpecs]).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={onGenerateBOQ} className="w-full bg-blue-600 hover:bg-blue-700">
                <Target className="w-4 h-4 mr-2" />
                Proceed to BOQ Generation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Zone Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {zones.map((zone) => (
              <div key={zone.id} className="p-3 bg-stone-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm">{zone.name}</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      {zone.area} • {zone.irrigationType}
                    </p>
                    {zone.cropType && (
                      <p className="text-xs text-stone-500">Crop: {zone.cropType}</p>
                    )}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      zone.status === 'Planned' ? 'border-yellow-200 text-yellow-700' :
                      zone.status === 'Active' ? 'border-blue-200 text-blue-700' :
                      'border-green-200 text-green-700'
                    }`}
                  >
                    {zone.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchemeDesignPanel;
