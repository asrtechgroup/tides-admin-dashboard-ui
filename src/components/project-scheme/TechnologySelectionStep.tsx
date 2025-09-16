import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Droplets, CheckCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useTechnologySelection } from '@/hooks/useTechnologySelection';

interface TechnologySelection {
  technologyName: string;
  irrigationType: string;
  technologyDetails?: any;
}

interface TechnologySelectionStepProps {
  data: TechnologySelection | null;
  projectId?: string;
  onUpdate: (data: TechnologySelection) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const TechnologySelectionStep: React.FC<TechnologySelectionStepProps> = ({
  data,
  projectId,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [selectedTechnology, setSelectedTechnology] = useState(data?.technologyName || '');
  const [selectedIrrigationType, setSelectedIrrigationType] = useState(data?.irrigationType || '');
  const [loading, setLoading] = useState(false);
  
  const { technologies, getTechnologyNames, getIrrigationTypesForTechnology, getTechnologyDetails, loading: technologiesLoading } = useTechnologySelection();

  const handleTechnologyChange = (value: string) => {
    setSelectedTechnology(value);
    setSelectedIrrigationType(''); // Reset irrigation type when technology changes
  };

  const handleIrrigationTypeChange = (value: string) => {
    setSelectedIrrigationType(value);
  };

  const handleSubmit = async () => {
    if (!selectedTechnology || !selectedIrrigationType) {
      toast.error('Please select both technology type and irrigation method');
      return;
    }

    if (!projectId) {
      toast.error('Project ID is required');
      return;
    }

    try {
      setLoading(true);
      
      const technologyDetails = getTechnologyDetails(selectedTechnology, selectedIrrigationType);
      
      const selectionData: TechnologySelection = {
        technologyName: selectedTechnology,
        irrigationType: selectedIrrigationType,
        technologyDetails
      };

      // TODO: Implement API call to POST /api/projects/:id/technology/
      // const response = await projectAPI.saveTechnologySelection(projectId, selectionData);
      
      onUpdate(selectionData);
      toast.success('Technology selection saved successfully');
      onNext();
      
    } catch (error) {
      console.error('Error saving technology selection:', error);
      toast.error('Failed to save technology selection');
    } finally {
      setLoading(false);
    }
  };

  if (technologiesLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading irrigation technologies...</p>
        </CardContent>
      </Card>
    );
  }

  const technologyNames = getTechnologyNames();
  const availableIrrigationTypes = selectedTechnology ? getIrrigationTypesForTechnology(selectedTechnology) : [];
  const selectedTechnologyDetails = selectedTechnology && selectedIrrigationType ? getTechnologyDetails(selectedTechnology, selectedIrrigationType) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5" />
          Technology Selection
        </CardTitle>
        <CardDescription>
          Select the irrigation technology and method for your project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Technology Type Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Irrigation Technology Type</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the primary irrigation technology for your project
              </p>
            </div>
            
            <RadioGroup value={selectedTechnology} onValueChange={handleTechnologyChange}>
              {technologyNames.map((tech) => (
                <div key={tech} className="flex items-center space-x-2">
                  <RadioGroupItem value={tech} id={tech} />
                  <Label htmlFor={tech} className="cursor-pointer capitalize">
                    {tech} Irrigation
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Irrigation Type Selection */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Irrigation Method</Label>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedTechnology ? 
                  `Select specific method for ${selectedTechnology} irrigation` : 
                  'Select a technology type first'
                }
              </p>
            </div>
            
            {selectedTechnology ? (
              <RadioGroup value={selectedIrrigationType} onValueChange={handleIrrigationTypeChange}>
                {availableIrrigationTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="cursor-pointer capitalize">
                      {type.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <p className="text-muted-foreground text-sm">
                Please select a technology type first
              </p>
            )}
          </div>
        </div>

        {/* Technology Details Preview */}
        {selectedTechnologyDetails && (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Selected Technology Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Technology</Label>
                  <p className="capitalize">{selectedTechnologyDetails.technology_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Irrigation Type</Label>
                  <p className="capitalize">{selectedTechnologyDetails.irrigation_type?.replace('_', ' ')}</p>
                </div>
                {selectedTechnologyDetails.efficiency && (
                  <div>
                    <Label className="text-sm font-medium">Efficiency</Label>
                    <p>{selectedTechnologyDetails.efficiency}%</p>
                  </div>
                )}
                {selectedTechnologyDetails.maintenance_level && (
                  <div>
                    <Label className="text-sm font-medium">Maintenance Level</Label>
                    <Badge variant="secondary">{selectedTechnologyDetails.maintenance_level}</Badge>
                  </div>
                )}
              </div>
              
              {selectedTechnologyDetails.description && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTechnologyDetails.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Basic Information
          </Button>
          
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !selectedTechnology || !selectedIrrigationType}
          >
            {loading ? 'Saving...' : (
              <>
                Next: Crop Calendar
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnologySelectionStep;