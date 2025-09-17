import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Import workflow components
import WorkflowStepper from '@/components/boq/WorkflowStepper';
import ProjectDataStep from '@/components/boq/ProjectDataStep';
import UnitPricesStep from '@/components/boq/UnitPricesStep';
import WorkQuantitiesStep from '@/components/boq/WorkQuantitiesStep';
import ReportGenerationStep from '@/components/boq/ReportGenerationStep';

// Types
interface ProjectData {
  name: string;
  location: string;
  area: number;
  irrigationType: string;
  description: string;
  startDate: string;
  endDate: string;
  waterSource: string;
  soilType: string;
}

interface UnitPrice {
  id: string;
  name: string;
  description: string;
  unit: string;
  rate: number;
  category: string;
}

interface WorkItem {
  id: string;
  description: string;
  category: 'labor' | 'materials' | 'equipment';
  unitPriceId: string;
  quantity: number;
  unitRate: number;
  totalAmount: number;
}

const BOQBuilder = () => {
  const { hasPermission } = useAuth();
  const [currentStep, setCurrentStep] = useState('project-data');
  
  // Workflow data state
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    location: '',
    area: 0,
    irrigationType: '',
    description: '',
    startDate: '',
    endDate: '',
    waterSource: '',
    soilType: ''
  });

  const [laborPrices, setLaborPrices] = useState<UnitPrice[]>([]);
  const [materialPrices, setMaterialPrices] = useState<UnitPrice[]>([]);
  const [equipmentPrices, setEquipmentPrices] = useState<UnitPrice[]>([]);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);

  // Check permissions
  if (!hasPermission('boq_builder')) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access the BOQ Builder. Please contact your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Workflow steps configuration
  const steps = [
    {
      id: 'project-data',
      title: 'Project Data',
      description: 'Basic information',
      completed: currentStep !== 'project-data' && projectData.name !== '',
      current: currentStep === 'project-data'
    },
    {
      id: 'unit-prices',
      title: 'Unit Prices',
      description: 'Labor, Materials, Equipment',
      completed: currentStep !== 'project-data' && currentStep !== 'unit-prices' && 
                (laborPrices.length > 0 || materialPrices.length > 0 || equipmentPrices.length > 0),
      current: currentStep === 'unit-prices'
    },
    {
      id: 'work-quantities',
      title: 'Work Quantities',
      description: 'Enter quantities',
      completed: currentStep !== 'project-data' && currentStep !== 'unit-prices' && 
                currentStep !== 'work-quantities' && workItems.length > 0,
      current: currentStep === 'work-quantities'
    },
    {
      id: 'report-generation',
      title: 'Generate Report',
      description: 'BOQ Report (PDF/Excel)',
      completed: false,
      current: currentStep === 'report-generation'
    }
  ];

  // Navigation handlers
  const handleNextStep = () => {
    switch (currentStep) {
      case 'project-data':
        setCurrentStep('unit-prices');
        break;
      case 'unit-prices':
        setCurrentStep('work-quantities');
        break;
      case 'work-quantities':
        setCurrentStep('report-generation');
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'unit-prices':
        setCurrentStep('project-data');
        break;
      case 'work-quantities':
        setCurrentStep('unit-prices');
        break;
      case 'report-generation':
        setCurrentStep('work-quantities');
        break;
    }
  };

  const handlePricesChange = (labor: UnitPrice[], materials: UnitPrice[], equipment: UnitPrice[]) => {
    setLaborPrices(labor);
    setMaterialPrices(materials);
    setEquipmentPrices(equipment);
  };

  const handleComplete = () => {
    toast.success('BOQ Builder workflow completed successfully!');
    // Reset to start or navigate to a different page
    setCurrentStep('project-data');
  };

  const handleStartOver = () => {
    setProjectData({
      name: '',
      location: '',
      area: 0,
      irrigationType: '',
      description: '',
      startDate: '',
      endDate: '',
      waterSource: '',
      soilType: ''
    });
    setLaborPrices([]);
    setMaterialPrices([]);
    setEquipmentPrices([]);
    setWorkItems([]);
    setCurrentStep('project-data');
    toast.success('BOQ Builder reset successfully');
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'project-data':
        return (
          <ProjectDataStep
            projectData={projectData}
            onProjectDataChange={setProjectData}
            onNext={handleNextStep}
          />
        );
      
      case 'unit-prices':
        return (
          <UnitPricesStep
            laborPrices={laborPrices}
            materialPrices={materialPrices}
            equipmentPrices={equipmentPrices}
            onPricesChange={handlePricesChange}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      
      case 'work-quantities':
        return (
          <WorkQuantitiesStep
            laborPrices={laborPrices}
            materialPrices={materialPrices}
            equipmentPrices={equipmentPrices}
            workItems={workItems}
            onWorkItemsChange={setWorkItems}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      
      case 'report-generation':
        return (
          <ReportGenerationStep
            projectData={projectData}
            laborPrices={laborPrices}
            materialPrices={materialPrices}
            equipmentPrices={equipmentPrices}
            workItems={workItems}
            onPrevious={handlePreviousStep}
            onComplete={handleComplete}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">BOQ Builder</h1>
            <p className="text-muted-foreground">
              Follow the step-by-step workflow to create comprehensive Bills of Quantities
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleStartOver}>
              Start Over
            </Button>
          </div>
        </div>

        {/* Workflow Stepper */}
        <WorkflowStepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Current Step Content */}
      <div className="space-y-6">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default BOQBuilder;