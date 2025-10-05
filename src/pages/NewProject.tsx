import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';
import BasicInfoTechnologyStep from '@/components/projects/steps/BasicInfoTechnologyStep';
import CropCalendarCWRStep from '@/components/projects/steps/CropCalendarCWRStep';
import HydraulicDesignStep from '@/components/projects/steps/HydraulicDesignStep';
import CostingStep from '@/components/projects/steps/CostingStep';
import BOQGenerationStep from '@/components/projects/steps/BOQGenerationStep';

interface ProjectData {
  projectName: string;
  basicInfo?: any;
  cropCalendar?: any;
  hydraulicDesign?: any;
  costing?: any;
}

const NewProject = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState<ProjectData>({ projectName: '' });
  const [showNameDialog, setShowNameDialog] = useState(true);

  const steps = [
    { id: 0, title: 'Basic Information & Technology', component: BasicInfoTechnologyStep },
    { id: 1, title: 'Crop Calendar & CWR', component: CropCalendarCWRStep },
    { id: 2, title: 'Hydraulic Design', component: HydraulicDesignStep },
    { id: 3, title: 'Costing', component: CostingStep },
    { id: 4, title: 'BOQ Generation', component: BOQGenerationStep }
  ];

  const handleCreateProject = () => {
    if (!projectData.projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }
    setShowNameDialog(false);
    toast.success('Project created! Let\'s start with basic information.');
  };

  const handleStepComplete = (stepData: any) => {
    setProjectData({ ...projectData, ...stepData });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep].component;

  if (showNameDialog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <FolderPlus className="w-8 h-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl">Create New Project</CardTitle>
            <CardDescription>
              Enter a name for your irrigation project to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="e.g., Northern Valley Irrigation Scheme"
                value={projectData.projectName}
                onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/projects')}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleCreateProject}
              >
                Create Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{projectData.projectName}</h1>
            <p className="text-muted-foreground mt-1">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`text-xs text-center flex-1 ${
                      index <= currentStep ? 'text-emerald-600 font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                      index <= currentStep ? 'bg-emerald-600 text-white' : 'bg-muted'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="hidden md:inline">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <CurrentStepComponent
          data={projectData}
          onUpdate={handleStepComplete}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
