
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Wrench } from 'lucide-react';
import { CropWaterRequirement, HydraulicDesign } from '@/types/project-wizard';
import { useToast } from '@/hooks/use-toast';

interface SchemeDesignStepProps {
  data: {
    cropWaterRequirements: CropWaterRequirement[];
    hydraulicDesign: HydraulicDesign;
  };
  onUpdate: (data: Partial<{ cropWaterRequirements: CropWaterRequirement[]; hydraulicDesign: HydraulicDesign }>) => void;
}

const SchemeDesignStep: React.FC<SchemeDesignStepProps> = ({ data, onUpdate }) => {
  const { toast } = useToast();

  const calculateCropWaterRequirement = async () => {
    // Mock API call
    toast({
      title: "Calculating...",
      description: "Computing crop water requirements",
    });
    
    setTimeout(() => {
      const mockRequirements: CropWaterRequirement[] = [
        { cropName: 'Wheat', waterRequirement: 450, unit: 'mm/season' },
        { cropName: 'Rice', waterRequirement: 700, unit: 'mm/season' },
      ];
      onUpdate({ cropWaterRequirements: mockRequirements });
      toast({
        title: "Calculation Complete",
        description: "Crop water requirements have been calculated",
      });
    }, 2000);
  };

  const generateHydraulicDesign = async () => {
    // Mock API call
    toast({
      title: "Generating Design...",
      description: "Creating hydraulic design cross-section",
    });
    
    setTimeout(() => {
      const mockDesign: HydraulicDesign = {
        crossSectionUrl: '/placeholder-cross-section.png',
        designParameters: {
          channelWidth: 2.5,
          channelDepth: 1.8,
          slope: 0.001,
          roughness: 0.025
        }
      };
      onUpdate({ hydraulicDesign: mockDesign });
      toast({
        title: "Design Generated",
        description: "Hydraulic design has been created",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Crop Water Requirement</CardTitle>
            </div>
            <CardDescription>Calculate water needs for selected crops</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={calculateCropWaterRequirement} className="w-full">
              Calculate Water Requirements
            </Button>
            
            {data.cropWaterRequirements.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Results:</h4>
                {data.cropWaterRequirements.map((req, index) => (
                  <div key={index} className="flex justify-between p-2 bg-stone-50 rounded">
                    <span>{req.cropName}</span>
                    <span className="font-medium">{req.waterRequirement} {req.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Wrench className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Hydraulic Design</CardTitle>
            </div>
            <CardDescription>Generate cross-section and design parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={generateHydraulicDesign} className="w-full">
              Generate Hydraulic Design
            </Button>
            
            {data.hydraulicDesign.crossSectionUrl && (
              <div className="space-y-2">
                <h4 className="font-medium">Cross-Section:</h4>
                <div className="h-32 bg-stone-100 rounded border flex items-center justify-center">
                  <span className="text-stone-500">Cross-section diagram placeholder</span>
                </div>
                <div className="text-sm text-stone-600">
                  <p>Width: {data.hydraulicDesign.designParameters.channelWidth}m</p>
                  <p>Depth: {data.hydraulicDesign.designParameters.channelDepth}m</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchemeDesignStep;
