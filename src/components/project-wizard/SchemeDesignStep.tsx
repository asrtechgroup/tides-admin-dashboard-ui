
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calculator, Wrench, FileText } from 'lucide-react';
import { CropWaterRequirement, HydraulicDesign } from '@/types/project-wizard';
import { useToast } from '@/hooks/use-toast';

interface SchemeDesignStepProps {
  data: {
    cropWaterRequirements: CropWaterRequirement[];
    hydraulicDesign: HydraulicDesign;
  };
  onUpdate: (data: Partial<{ cropWaterRequirements: CropWaterRequirement[]; hydraulicDesign: HydraulicDesign }>) => void;
}

// Mock existing projects data
const existingProjects = [
  { id: '1', name: 'Kilombero Rice Scheme', area: '1,250 ha', location: 'Morogoro', crops: ['Rice', 'Maize'] },
  { id: '2', name: 'Mbarali Wheat Project', area: '850 ha', location: 'Mbeya', crops: ['Wheat', 'Soybean'] },
  { id: '3', name: 'Usangu Plains Irrigation', area: '2,100 ha', location: 'Mbeya', crops: ['Rice', 'Vegetables'] },
  { id: '4', name: 'Wami River Scheme', area: '675 ha', location: 'Pwani', crops: ['Sugarcane', 'Maize'] },
];

const SchemeDesignStep: React.FC<SchemeDesignStepProps> = ({ data, onUpdate }) => {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState('');
  const [calculationSource, setCalculationSource] = useState<'current' | 'existing'>('current');
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  const calculateCropWaterRequirement = async () => {
    if (calculationSource === 'existing' && !selectedProject) {
      setShowProjectDialog(true);
      return;
    }

    toast({
      title: "Calculating...",
      description: calculationSource === 'current' 
        ? "Computing crop water requirements for current project" 
        : `Computing water requirements from ${existingProjects.find(p => p.id === selectedProject)?.name}`,
    });
    
    setTimeout(() => {
      let mockRequirements: CropWaterRequirement[];
      
      if (calculationSource === 'existing') {
        const project = existingProjects.find(p => p.id === selectedProject);
        mockRequirements = project?.crops.map(crop => ({
          cropName: crop,
          waterRequirement: crop === 'Rice' ? 700 : crop === 'Wheat' ? 450 : crop === 'Sugarcane' ? 1200 : 350,
          unit: 'mm/season'
        })) || [];
      } else {
        mockRequirements = [
          { cropName: 'Wheat', waterRequirement: 450, unit: 'mm/season' },
          { cropName: 'Rice', waterRequirement: 700, unit: 'mm/season' },
        ];
      }
      
      onUpdate({ cropWaterRequirements: mockRequirements });
      toast({
        title: "Calculation Complete",
        description: "Crop water requirements have been calculated",
      });
      setShowProjectDialog(false);
    }, 2000);
  };

  const generateHydraulicDesign = async () => {
    toast({
      title: "Generating Design...",
      description: "Creating hydraulic design cross-section",
    });
    
    setTimeout(() => {
      const mockDesign: HydraulicDesign = {
        crossSectionUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=400&fit=crop',
        designParameters: {
          channelWidth: 2.5,
          channelDepth: 1.8,
          slope: 0.001,
          roughness: 0.025,
          flowVelocity: 0.8,
          discharge: 3.6
        }
      };
      onUpdate({ hydraulicDesign: mockDesign });
      toast({
        title: "Design Generated",
        description: "Hydraulic design has been created",
      });
    }, 2000);
  };

  const handleProjectSelection = (projectId: string) => {
    setSelectedProject(projectId);
    setCalculationSource('existing');
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
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="current-project"
                  name="calculation-source"
                  checked={calculationSource === 'current'}
                  onChange={() => setCalculationSource('current')}
                  className="w-4 h-4"
                />
                <label htmlFor="current-project" className="text-sm font-medium">
                  Use Current Project Data
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="existing-project"
                  name="calculation-source"
                  checked={calculationSource === 'existing'}
                  onChange={() => setCalculationSource('existing')}
                  className="w-4 h-4"
                />
                <label htmlFor="existing-project" className="text-sm font-medium">
                  Use Existing Project Data
                </label>
              </div>

              {calculationSource === 'existing' && (
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select existing project" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{project.name}</span>
                          <span className="text-xs text-stone-500">
                            {project.area} • {project.location} • {project.crops.join(', ')}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

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
              <div className="space-y-3">
                <h4 className="font-medium">Cross-Section Design:</h4>
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={data.hydraulicDesign.crossSectionUrl} 
                    alt="Hydraulic Cross-Section" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-stone-50 p-2 rounded">
                    <span className="text-stone-600">Width:</span>
                    <div className="font-medium">{data.hydraulicDesign.designParameters.channelWidth}m</div>
                  </div>
                  <div className="bg-stone-50 p-2 rounded">
                    <span className="text-stone-600">Depth:</span>
                    <div className="font-medium">{data.hydraulicDesign.designParameters.channelDepth}m</div>
                  </div>
                  <div className="bg-stone-50 p-2 rounded">
                    <span className="text-stone-600">Slope:</span>
                    <div className="font-medium">{data.hydraulicDesign.designParameters.slope}</div>
                  </div>
                  <div className="bg-stone-50 p-2 rounded">
                    <span className="text-stone-600">Discharge:</span>
                    <div className="font-medium">{data.hydraulicDesign.designParameters.discharge} m³/s</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Existing Project</DialogTitle>
            <DialogDescription>
              Choose a project to use its data for water requirement calculations
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {existingProjects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-4 cursor-pointer hover:bg-stone-50 transition-colors"
                onClick={() => handleProjectSelection(project.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-stone-600">
                      {project.area} • {project.location}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.crops.map((crop) => (
                        <span key={crop} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                  <FileText className="w-5 h-5 text-stone-400" />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchemeDesignStep;
