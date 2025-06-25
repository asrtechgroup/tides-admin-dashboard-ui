
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProjectWizardData, WIZARD_STEPS } from '@/types/project-wizard';
import ProjectInfoStep from '@/components/project-wizard/ProjectInfoStep';
import CropCalendarStep from '@/components/project-wizard/CropCalendarStep';
import TechnologySelectionStep from '@/components/project-wizard/TechnologySelectionStep';
import SchemeDesignStep from '@/components/project-wizard/SchemeDesignStep';
import ResourcesSelectionStep from '@/components/project-wizard/ResourcesSelectionStep';
import BOQSubmissionStep from '@/components/project-wizard/BOQSubmissionStep';

const ProjectWizard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectWizardData>({
    step: 0,
    projectInfo: {
      name: '',
      description: '',
      zone: '',
      regions: [],
      districts: [],
      schemeName: '',
      waterSources: [],
      cropVarieties: []
    },
    cropCalendar: [],
    technologySelection: {
      technologyType: '',
      irrigationType: '',
      efficiency: 0,
      specifications: ''
    },
    cropWaterRequirements: [],
    hydraulicDesign: { designParameters: {} },
    resourceSelection: [],
    boqItems: [],
    status: 'draft'
  });

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      console.log('Loading project:', id);
      toast({
        title: "Project Loaded",
        description: "Project data has been loaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load project data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProject = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API
      console.log('Saving project:', projectData);
      toast({
        title: "Project Saved",
        description: "Your progress has been saved as draft.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setProjectData(prev => ({ ...prev, step: currentStep + 1 }));
      saveProject();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProjectData(prev => ({ ...prev, step: currentStep - 1 }));
    }
  };

  const updateProjectData = (updates: Partial<ProjectWizardData>) => {
    setProjectData(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectInfoStep
            data={projectData.projectInfo}
            onUpdate={(projectInfo) => updateProjectData({ projectInfo })}
          />
        );
      case 1:
        return (
          <CropCalendarStep
            data={projectData.cropCalendar}
            onUpdate={(cropCalendar) => updateProjectData({ cropCalendar })}
            selectedCrops={projectData.projectInfo.cropVarieties}
          />
        );
      case 2:
        return (
          <TechnologySelectionStep
            data={projectData.technologySelection}
            onUpdate={(technologySelection) => updateProjectData({ technologySelection })}
          />
        );
      case 3:
        return (
          <SchemeDesignStep
            data={{
              cropWaterRequirements: projectData.cropWaterRequirements,
              hydraulicDesign: projectData.hydraulicDesign
            }}
            onUpdate={(data) => updateProjectData(data)}
          />
        );
      case 4:
        return (
          <ResourcesSelectionStep
            data={projectData.resourceSelection}
            onUpdate={(resourceSelection) => updateProjectData({ resourceSelection })}
          />
        );
      case 5:
        return (
          <BOQSubmissionStep
            data={{
              boqItems: projectData.resourceSelection.map(item => ({
                id: item.id,
                category: item.category,
                description: `${item.name} - ${item.description}`,
                quantity: item.quantity,
                unit: item.unit,
                rate: item.rate,
                amount: item.amount
              })),
              comments: projectData.comments
            }}
            onUpdate={(data) => updateProjectData(data)}
            onSubmit={() => {
              updateProjectData({ status: 'submitted' });
              toast({
                title: "Project Submitted",
                description: "Your project has been submitted for approval.",
              });
              navigate('/projects');
            }}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Project Wizard</h1>
          <p className="text-stone-600 mt-1">Create and manage irrigation projects step by step</p>
        </div>
        <Button onClick={saveProject} disabled={isLoading} variant="outline">
          <Save className="w-4 h-4 mr-2" />
          Save Draft
        </Button>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                Step {currentStep + 1}: {WIZARD_STEPS[currentStep]}
              </CardTitle>
              <span className="text-sm text-stone-600">
                {currentStep + 1} of {WIZARD_STEPS.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
          
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === WIZARD_STEPS.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectWizard;
