import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle, Circle } from 'lucide-react';
import ProjectBasicInfoStep from '@/components/project-scheme/ProjectBasicInfoStep';
import TechnologySelectionStep from '@/components/project-scheme/TechnologySelectionStep';
import CropCalendarStep from '@/components/project-scheme/CropCalendarStep';
import HydraulicDesignStep from '@/components/project-scheme/HydraulicDesignStep';
import ResourcesStep from '@/components/project-scheme/ResourcesStep';
import BOQCostingStep from '@/components/project-scheme/BOQCostingStep';

interface ProjectSchemeData {
  basicInfo: any;
  technology: any;
  cropCalendar: any;
  hydraulicDesign: any;
  resources: any;
  boq: any;
}

const STEPS = [
  { id: 1, title: 'Project Basic Information', description: 'Add project details, location, and GIS files' },
  { id: 2, title: 'Technology Selection', description: 'Select irrigation technology and options' },
  { id: 3, title: 'Crop Calendar & Water Requirement', description: 'Define crops, planting dates, and water needs' },
  { id: 4, title: 'Hydraulic Design', description: 'Review and configure hydraulic parameters' },
  { id: 5, title: 'Resources', description: 'Manage materials, equipment, and labor requirements' },
  { id: 6, title: 'BOQ & Costing', description: 'Generate bill of quantities and cost analysis' }
];

const ProjectScheme: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [projectData, setProjectData] = useState<ProjectSchemeData>({
    basicInfo: null,
    technology: null,
    cropCalendar: null,
    hydraulicDesign: null,
    resources: null,
    boq: null
  });

  const handleStepComplete = (stepId: number, data: any) => {
    const stepKey = Object.keys(projectData)[stepId - 1] as keyof ProjectSchemeData;
    setProjectData(prev => ({
      ...prev,
      [stepKey]: data
    }));
    
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    // Allow navigation only to completed steps or next step
    if (completedSteps.includes(stepId) || stepId === Math.max(...completedSteps, 0) + 1) {
      setCurrentStep(stepId);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectBasicInfoStep
            data={projectData.basicInfo}
            onUpdate={(data) => handleStepComplete(1, data)}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <TechnologySelectionStep
            data={projectData.technology}
            projectId={projectData.basicInfo?.id}
            onUpdate={(data) => handleStepComplete(2, data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <CropCalendarStep
            data={projectData.cropCalendar}
            projectId={projectData.basicInfo?.id}
            onUpdate={(data) => handleStepComplete(3, data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <HydraulicDesignStep
            data={projectData.hydraulicDesign}
            projectId={projectData.basicInfo?.id}
            onUpdate={(data) => handleStepComplete(4, data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <ResourcesStep
            data={projectData.resources}
            projectId={projectData.basicInfo?.id}
            onUpdate={(data) => handleStepComplete(5, data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 6:
        return (
          <BOQCostingStep
            data={projectData.boq}
            projectId={projectData.basicInfo?.id}
            projectData={projectData}
            onUpdate={(data) => handleStepComplete(6, data)}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  const progress = (completedSteps.length / STEPS.length) * 100;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Projects & Scheme Development</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive project planning and irrigation scheme development workflow
        </p>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.length} of {STEPS.length} steps completed
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Steps Navigation */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STEPS.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              const isAccessible = completedSteps.includes(step.id) || step.id === Math.max(...completedSteps, 0) + 1;
              
              return (
                <Card
                  key={step.id}
                  className={`cursor-pointer transition-all ${
                    isCurrent ? 'ring-2 ring-primary' : ''
                  } ${!isAccessible ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className={`w-5 h-5 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium text-sm ${isCurrent ? 'text-primary' : ''}`}>
                            {step.title}
                          </h3>
                          {isCurrent && <Badge variant="default" className="text-xs">Current</Badge>}
                          {isCompleted && <Badge variant="secondary" className="text-xs">Complete</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <div className="mb-6">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default ProjectScheme;